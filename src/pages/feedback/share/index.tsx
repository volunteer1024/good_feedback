import { Button, Canvas, Image, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useRef, useState } from 'react';
import TabBar from '../../../components/TabBar';
import './index.less';

interface Task {
  id: number;
  name: string;
  trackingType: string;
  value: any;
  status?: string; // Derived status
}

interface Student {
  id: number;
  name: string;
  avatar?: string;
  level?: string;
}

interface FeedbackData {
  student: Student;
  tasks: Task[];
  date: string;
}

const BACKGROUND_OPTIONS = [
  { id: 'white', class: 'bg-white', style: '#FFFFFF' },
  { id: 'stone', class: 'bg-stone', style: '#FAF9F6' },
  { id: 'teal', class: 'bg-teal', style: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)' },
  { id: 'orange', class: 'bg-orange', style: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' },
  { id: 'dark', class: 'bg-dark', style: '#1a1a1a' },
];

export default function FeedbackShare() {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const canvasRef = useRef<any>(null);

  // Helper
  const getMorandiColor = (name: string) => {
    const colors = [
      '#B4A7D6',
      '#A2C4C9',
      '#D5A6BD',
      '#C9B4A7',
      '#A7C4B4',
      '#C4A7B4',
      '#A7B4C9',
      '#B4C9A7',
      '#D6C4A7',
      '#A7D6C4',
    ];
    const index = name.charCodeAt(name.length - 1) % colors.length;
    return colors[index];
  };

  useLoad(() => {
    // Try to get data from preload
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();

    // Listen for data from opener
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', (receivedData: any) => {
        if (receivedData) {
          setData(receivedData);
        }
      });
    }

    // Also check preload (traditional Taro way)
    const preload = Taro.getCurrentInstance().preloadData as FeedbackData;
    if (preload) {
      setData(preload);
    }

    // Fallback/Mock for dev if empty
    if (!preload && (!eventChannel || !data)) {
      // Mock data
      setData({
        student: { id: 1, name: 'Alice', level: 'Piano Level 3' },
        tasks: [
          { id: 101, name: 'Scale Practice', trackingType: 'completed', value: 'good' },
          { id: 102, name: 'Hanon No.1', trackingType: 'completed', value: 'needs_work' },
        ],
        date: new Date().toLocaleDateString(),
      });
    }
  });

  const handleBack = () => {
    Taro.navigateBack();
  };

  const getStatusIcon = (task: Task) => {
    if (task.trackingType === 'completed') {
      if (task.value === 'needs_work') return '⚠️';
      return '✅';
    }
    if (task.trackingType === 'percentage') {
      return task.value >= 80 ? '✅' : '⚠️';
    }
    return '✅';
  };

  const drawCanvas = async () => {
    if (!data) return;

    Taro.showLoading({ title: 'Generating...' });

    try {
      const query = Taro.createSelectorQuery();
      query
        .select('#shareCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          if (!res[0] || !res[0].node) {
            Taro.hideLoading();
            Taro.showToast({ title: 'Canvas not found', icon: 'none' });
            return;
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // Set canvas size (Higher Res)
          // We want high res export: 1200x1500 (2x of 600x750)
          const EXPORT_WIDTH = 1200;
          const EXPORT_HEIGHT = 1500;

          canvas.width = EXPORT_WIDTH;
          canvas.height = EXPORT_HEIGHT;

          // Virtual scaling: We code for 600x750, but draw at 2x
          ctx.scale(2, 2);

          const w = 600;
          const h = 750;

          // Fill Background
          const bgOption = BACKGROUND_OPTIONS[bgIndex];
          if (bgOption.style.includes('gradient')) {
            // Simple parsing for gradient or just solid fallback for now
            // Simulating gradient
            const grd = ctx.createLinearGradient(0, 0, w, h);
            if (bgOption.id === 'teal') {
              grd.addColorStop(0, '#e0f2f1');
              grd.addColorStop(1, '#b2dfdb');
            } else {
              grd.addColorStop(0, '#fff3e0');
              grd.addColorStop(1, '#ffe0b2');
            }
            ctx.fillStyle = grd;
          } else {
            ctx.fillStyle = bgOption.style;
          }
          ctx.fillRect(0, 0, w, h);

          // Card Content
          // Draw border area (simulating the 16rpx white border)
          // On screen it's 16rpx ~ 8-16px depending on screen.
          // Let's make it proportional. 20px padding seems fine for 600px width.
          const padding = 20;

          // Inner White Card
          const innerX = padding;
          const innerY = padding;
          const innerW = w - padding * 2;
          const innerH = h - padding * 2;

          // Shadow simulation
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 40;
          ctx.shadowOffsetY = 20;
          ctx.beginPath();
          ctx.rect(innerX, innerY, innerW, innerH);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();

          // Top Bar
          ctx.fillStyle = '#13ecec';
          ctx.fillRect(innerX, innerY, innerW, 16);

          // Content Background
          ctx.fillStyle = '#fbfbf9'; // stone-50ish
          ctx.fillRect(innerX, innerY + 16, innerW, innerH - 16);

          // Date Tag
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.1)';
          ctx.shadowBlur = 4;
          ctx.fillRect(innerX + innerW - 100, innerY + 32, 80, 24);
          ctx.shadowColor = 'transparent';

          ctx.fillStyle = '#787774';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(new Date().toLocaleDateString(), innerX + innerW - 90, innerY + 48);

          // Avatar (Circle)
          const avatarRadius = 50;
          const avatarX = innerX + 40;
          const avatarY = innerY + 80;
          const centerX = avatarX + avatarRadius;
          const centerY = avatarY + avatarRadius;

          ctx.save();
          ctx.beginPath();
          // Clip circular mask
          ctx.arc(centerX, centerY, avatarRadius, 0, 2 * Math.PI);
          ctx.clip();

          // Draw Avatar
          if (!data.student.avatar) {
            const bgColor = getMorandiColor(data.student.name);
            ctx.fillStyle = bgColor;
            ctx.fillRect(avatarX, avatarY, avatarRadius * 2, avatarRadius * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.student.name.charAt(data.student.name.length - 1), centerX, centerY);
          } else {
            // Placeholder for image
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(avatarX, avatarY, avatarRadius * 2, avatarRadius * 2);
          }
          ctx.restore();

          // Badge
          const badgeSize = 30;
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX + 35, centerY + 35, badgeSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#13ecec';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.fill();
          ctx.stroke();
          // Text inside badge
          ctx.fillStyle = '#102222';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏫', centerX + 35, centerY + 35);
          ctx.restore();
          // ctx.restore(); // Removed redundant restore

          // Name
          const nameX = avatarX + avatarRadius * 2 + 24;
          const nameY = avatarY + avatarRadius; // center vertically with avatar

          ctx.fillStyle = '#37352F';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillText(data.student.name, nameX, nameY);

          ctx.fillStyle = '#787774';
          ctx.font = '500 18px sans-serif';
          ctx.textBaseline = 'top';
          ctx.fillText((data.student.level || 'Piano Student').toUpperCase(), nameX, nameY + 8);

          // Divider
          const dividerY = avatarY + avatarRadius * 2 + 30;
          ctx.beginPath();
          ctx.strokeStyle = '#E9E9E7';
          ctx.lineWidth = 2;
          ctx.moveTo(innerX + 30, dividerY);
          ctx.lineTo(innerX + innerW - 30, dividerY);
          ctx.stroke();

          // Tasks
          let currentY = dividerY + 40;
          data.tasks.forEach((task) => {
            const icon = getStatusIcon(task);

            // Checkbox / Icon
            ctx.font = '32px sans-serif';
            ctx.textBaseline = 'top';
            if (icon === '✅') {
              ctx.fillStyle = '#16a34a';
            } else {
              ctx.fillStyle = '#f59e0b';
            }
            ctx.fillText(icon, innerX + 40, currentY);

            // Text
            ctx.fillStyle = '#37352F';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(task.name, innerX + 90, currentY);

            // Subtext
            ctx.fillStyle = '#787774';
            ctx.font = '20px sans-serif';
            let desc = 'Completed';
            if (task.trackingType === 'percentage') desc = `Progress: ${task.value}%`;
            if (task.value === 'needs_work') desc = 'Needs more practice';
            ctx.fillText(desc, innerX + 90, currentY + 32);

            currentY += 80;
          });

          // Footer
          const footerY = innerY + innerH - 60;
          ctx.beginPath();
          ctx.strokeStyle = '#E9E9E7';
          ctx.setLineDash([8, 8]);
          ctx.moveTo(innerX + 30, footerY);
          ctx.lineTo(innerX + innerW - 30, footerY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#37352F';
          ctx.font = 'bold 16px sans-serif';
          ctx.globalAlpha = 0.5;
          ctx.textAlign = 'left';
          ctx.fillText('🎹 STUDIO MATE', innerX + 30, footerY + 30);
          ctx.globalAlpha = 1.0;

          ctx.fillStyle = '#787774';
          ctx.textAlign = 'right';
          ctx.font = 'italic 16px sans-serif';
          ctx.fillText('Instructor: Sarah', innerX + innerW - 30, footerY + 30);

          // Save to Album
          setTimeout(() => {
            Taro.canvasToTempFilePath({
              canvas,
              success: (fileRes) => {
                Taro.saveImageToPhotosAlbum({
                  filePath: fileRes.tempFilePath,
                  success: () => {
                    Taro.showToast({ title: 'Saved!', icon: 'success' });
                  },
                  fail: (err) => {
                    Taro.showToast({ title: 'Save failed', icon: 'none' });
                    console.error(err);
                  },
                });
              },
              fail: (err) => {
                console.error('Canvas to temp file failed', err);
              },
              complete: () => {
                Taro.hideLoading();
              },
            });
          }, 200);
        });
    } catch (e) {
      Taro.hideLoading();
      console.error(e);
    }
  };

  const currentBg = BACKGROUND_OPTIONS[bgIndex];

  // Style mapping for preview
  const getContainerStyle = () => {
    if (currentBg.style.startsWith('#')) return { backgroundColor: currentBg.style };
    if (currentBg.style.includes('gradient')) return { background: currentBg.style };
    return {};
  };

  if (!data)
    return (
      <View className="share-page">
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View className={`share-page ${bgIndex === 4 ? 'dark' : ''}`}>
      {/* Hidden Canvas for generation */}
      <Canvas
        type="2d"
        id="shareCanvas"
        style={{ position: 'fixed', left: '-9999px', width: '600px', height: '750px' }}
      />

      <View className="header">
        <View className="btn-back" onClick={handleBack}>
          <Text className="icon-back" style={{ fontSize: '40rpx' }}>
            ⬅️
          </Text>
        </View>
        <Text className="title">Feedback Generated</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="main-content" scrollY>
        <View className="card-container">
          {/* Card View */}
          <View
            className={`feedback-card ${bgIndex === 4 ? 'dark-mode' : ''}`}
            style={getContainerStyle()}
          >
            <View className="top-bar" />
            <View className="card-content">
              <View className="date-tag">
                <Text>
                  {new Date().getDate()}{' '}
                  {new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                </Text>
              </View>

              <View className="user-info">
                <View className="avatar-wrapper">
                  {data.student.avatar ? (
                    <Image className="avatar" src={data.student.avatar} mode="aspectFill" />
                  ) : (
                    <View
                      className="avatar"
                      style={{
                        backgroundColor: getMorandiColor(data.student.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                        {data.student.name.charAt(data.student.name.length - 1)}
                      </Text>
                    </View>
                  )}
                  <View className="badge">
                    <Text style={{ fontSize: '20rpx' }}>🏫</Text>
                  </View>
                </View>
                <View>
                  <View className="t-name">
                    <Text>{data.student.name}</Text>
                  </View>
                  <View className="t-level">
                    <Text>{data.student.level || 'Piano Student'}</Text>
                  </View>
                </View>
              </View>

              <View className="divider" />

              <View className="task-list">
                {data.tasks.map((task, idx) => (
                  <View key={idx} className="task-item">
                    <View className="status-icon">
                      <Text>{getStatusIcon(task)}</Text>
                    </View>
                    <View className="task-detail">
                      <Text className="task-title">{task.name}</Text>
                      <View className="task-desc">
                        {task.trackingType === 'percentage' && <Text>Progress: {task.value}%</Text>}
                        {task.trackingType === 'completed' && (
                          <Text>{task.value === 'needs_work' ? 'Needs Work' : 'Good job'}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View className="card-footer">
                <View className="brand">
                  <Text>🎹</Text>
                  <Text>STUDIO MATE</Text>
                </View>
                <Text className="instructor">Instructor: Sarah</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Background Selector */}
        <View className="bg-selector">
          <Text className="label">Card Background</Text>
          <View className="options">
            {BACKGROUND_OPTIONS.map((opt, idx) => (
              <View
                key={opt.id}
                className={`bg-btn ${idx === bgIndex ? 'active' : ''}`}
                onClick={() => setBgIndex(idx)}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: opt.style,
                  }}
                />
                {idx === bgIndex && (
                  <View
                    style={{ position: 'absolute', color: opt.id === 'white' ? 'black' : 'white' }}
                  >
                    <Text>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View className="bottom-actions">
        <View className="gradient-overlay" />
        <View className="action-container">
          <View className="btn-group">
            <View className="btn btn-save" onClick={drawCanvas}>
              <Text>💾</Text>
              <Text>Save Image</Text>
            </View>
            <Button className="btn btn-share" openType="share">
              <Text>📤</Text>
              <Text>Share</Text>
            </Button>
          </View>
        </View>
      </View>

      <TabBar activeTab="feedback" />
    </View>
  );
}
