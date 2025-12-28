import { Button, Image, Input, ScrollView, Slider, Text, View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useMemo, useState } from 'react';
import TabBar from '../../components/TabBar';
import { studentService } from '../../services/student';
import './index.less';

// 获取莫兰迪色系背景色
const getMorandiColor = (name) => {
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

// 获取今天的日期字符串
const getTodayStr = () => {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  return `${month} ${day}`;
};

// 检查是否是生日
const isBirthday = (birthday) => {
  if (!birthday) return false;
  const today = new Date();
  const birth = new Date(birthday);
  return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
};

// 追踪类型配置
const TRACKING_TYPE_CONFIG = {
  percentage: {
    icon: '%',
    label: '百分比 (Percentage)',
    quickOptions: [50, 80, 90, 100],
  },
  page_number: {
    icon: '📖',
    label: '页码 (Page Number)',
  },
  completed: {
    icon: '✓',
    label: '完成 (Completed)',
    options: [
      { value: 'excellent', label: 'Excellent', subLabel: '优' },
      { value: 'good', label: 'Good', subLabel: '良' },
      { value: 'needs_work', label: 'Needs Work', subLabel: '需练习' },
    ],
  },
  not_completed: {
    icon: '○',
    label: '未完成 (Not Completed)',
  },
};

const Feedback = () => {
  const router = useRouter();

  // 从真实数据加载学生
  const [students, setStudents] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryHint, setShowHistoryHint] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载学生数据
  useDidShow(() => {
    loadStudents();
  });

  const loadStudents = () => {
    // 从 URL 参数获取学生 ID 列表
    const { studentIds } = router.params;

    // 获取所有学生数据
    const allStudents = studentService.getStudents();

    let targetStudents = [];
    if (studentIds) {
      // 如果有传入学生 ID，只加载这些学生
      const ids = studentIds.split(',').map((id) => parseInt(id));
      targetStudents = allStudents.filter((s) => ids.includes(s.id));
    } else {
      // 否则加载所有 In Class 的学生
      targetStudents = allStudents.filter((s) => s.status === 'In Class');
    }

    // 为每个学生添加 feedbackDone 状态
    const studentsWithStatus = targetStudents.map((s) => ({
      ...s,
      feedbackDone: false,
    }));

    setStudents(studentsWithStatus);

    // 设置第一个学生为当前学生
    if (studentsWithStatus.length > 0 && !currentStudentId) {
      setCurrentStudentId(studentsWithStatus[0].id);
    }
  };

  // 当前学生的作业列表
  const [studentTasks, setStudentTasks] = useState({
    1: [
      {
        id: 1,
        taskId: 101,
        name: 'Scale Practice - G Major',
        trackingType: 'percentage',
        value: 75,
      },
      {
        id: 2,
        taskId: 102,
        name: 'Czerny Etude No. 5',
        trackingType: 'page_number',
        startPage: 12,
        endPage: 14,
      },
      {
        id: 3,
        taskId: 103,
        name: 'Hanon Exercise No. 1',
        trackingType: 'completed',
        value: 'good',
      },
    ],
  });

  // 可选的作业库
  const [taskBank] = useState([
    { id: 101, name: 'Little Prelude in C Minor', subtitle: 'J.S. Bach • BWV 999', icon: '🎵' },
    { id: 102, name: 'Sonatina in G Major', subtitle: 'Beethoven • Anh. 5', icon: '🎹' },
    { id: 103, name: 'Sight Reading Level 2', subtitle: 'Exercise 15-20', icon: '📖' },
    { id: 104, name: 'Moonlight Sonata', subtitle: 'Beethoven • 1st Movement', icon: '🎵' },
    { id: 105, name: 'Scales & Arpeggios', subtitle: 'A Minor Harmonic', icon: '⚡' },
  ]);

  const [selectedTasks, setSelectedTasks] = useState([]);

  // 排序学生：未完成在前，已完成在后
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      if (a.feedbackDone === b.feedbackDone) return 0;
      return a.feedbackDone ? 1 : -1;
    });
  }, [students]);

  const currentStudent = students.find((s) => s.id === currentStudentId);
  const currentTasks = studentTasks[currentStudentId] || [];

  // 过滤作业库
  const filteredTaskBank = useMemo(() => {
    if (!searchQuery) return taskBank;
    const query = searchQuery.toLowerCase();
    return taskBank.filter(
      (task) =>
        task.name.toLowerCase().includes(query) || task.subtitle.toLowerCase().includes(query),
    );
  }, [taskBank, searchQuery]);

  const handleSelectStudent = (id) => {
    setCurrentStudentId(id);
  };

  const handleTaskValueChange = (taskIndex, field, value) => {
    setStudentTasks((prev) => {
      const tasks = [...(prev[currentStudentId] || [])];
      tasks[taskIndex] = { ...tasks[taskIndex], [field]: value };
      return { ...prev, [currentStudentId]: tasks };
    });
  };

  const handleRemoveTask = (taskIndex) => {
    setStudentTasks((prev) => {
      const tasks = [...(prev[currentStudentId] || [])];
      tasks.splice(taskIndex, 1);
      return { ...prev, [currentStudentId]: tasks };
    });
  };

  const handleToggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      }
      return [...prev, taskId];
    });
  };

  const handleAddSelectedTasks = () => {
    const newTasks = selectedTasks.map((taskId) => {
      const task = taskBank.find((t) => t.id === taskId);
      return {
        id: Date.now() + taskId,
        taskId: taskId,
        name: task.name,
        trackingType: 'completed',
        value: null,
      };
    });

    setStudentTasks((prev) => ({
      ...prev,
      [currentStudentId]: [...(prev[currentStudentId] || []), ...newTasks],
    }));

    setSelectedTasks([]);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleCompleteFeedback = () => {
    // 标记当前学生反馈完成
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudentId ? { ...s, feedbackDone: true } : s)),
    );

    // 找到下一个未完成的学生
    const nextStudent = sortedStudents.find((s) => !s.feedbackDone && s.id !== currentStudentId);
    if (nextStudent) {
      setCurrentStudentId(nextStudent.id);
    }

    Taro.showToast({ title: '反馈已保存', icon: 'success' });
  };

  // 渲染作业项
  const renderTaskCard = (task, index) => {
    const config = TRACKING_TYPE_CONFIG[task.trackingType] || TRACKING_TYPE_CONFIG.completed;

    return (
      <View className="task-card" key={task.id}>
        <View className="task-header">
          <View className="task-info">
            <Text className="task-name">{task.name}</Text>
            <View className="task-type">
              <Text className="type-icon">{config.icon}</Text>
              <Text className="type-label">{config.label}</Text>
            </View>
          </View>
          <View className="btn-delete" onClick={() => handleRemoveTask(index)}>
            <Text>🗑</Text>
          </View>
        </View>

        {/* 百分比类型 */}
        {task.trackingType === 'percentage' && (
          <View className="percentage-control">
            <View className="progress-header">
              <Text className="progress-label">Progress</Text>
              <Text className="progress-value">{task.value || 0}%</Text>
            </View>
            <Slider
              value={task.value || 0}
              min={0}
              max={100}
              step={1}
              activeColor="#13ecec"
              backgroundColor="#e5e7eb"
              blockSize={20}
              onChange={(e) => handleTaskValueChange(index, 'value', e.detail.value)}
            />
            <View className="quick-options">
              {config.quickOptions.map((opt) => (
                <View
                  key={opt}
                  className={`quick-btn ${task.value === opt ? 'active' : ''}`}
                  onClick={() => handleTaskValueChange(index, 'value', opt)}
                >
                  <Text>{opt}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 页码类型 */}
        {task.trackingType === 'page_number' && (
          <View className="page-control">
            <View className="page-input-group">
              <View className="page-input-wrapper">
                <Text className="page-label">Start Pg</Text>
                <Input
                  className="page-input"
                  type="number"
                  value={task.startPage?.toString() || ''}
                  onInput={(e) =>
                    handleTaskValueChange(index, 'startPage', parseInt(e.detail.value) || '')
                  }
                  placeholder="--"
                />
              </View>
              <Text className="page-divider">/</Text>
              <View className="page-input-wrapper">
                <Text className="page-label">End Pg</Text>
                <Input
                  className="page-input"
                  type="number"
                  value={task.endPage?.toString() || ''}
                  onInput={(e) =>
                    handleTaskValueChange(index, 'endPage', parseInt(e.detail.value) || '')
                  }
                  placeholder="--"
                />
              </View>
            </View>
          </View>
        )}

        {/* 完成度类型 */}
        {task.trackingType === 'completed' && (
          <View className="status-control">
            {config.options.map((opt) => (
              <View
                key={opt.value}
                className={`status-btn ${task.value === opt.value ? 'active' : ''}`}
                onClick={() => handleTaskValueChange(index, 'value', opt.value)}
              >
                <Text className="status-label">{opt.label}</Text>
                <Text className="status-sub">{opt.subLabel}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 未完成类型 - 简单标记 */}
        {task.trackingType === 'not_completed' && (
          <View className="not-completed-control">
            <Text className="not-completed-text">此任务标记为未完成</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="feedback-page">
      {/* Header */}
      <View className="header">
        <View className="btn-back" onClick={() => Taro.navigateBack()}>
          <Text style={{ fontSize: '40rpx' }}>‹</Text>
        </View>
        <Text className="title">Feedback Center</Text>
        <View style={{ width: '80rpx' }} />
      </View>

      {/* 学生头像列表 */}
      <View className="student-selector">
        <ScrollView scrollY className="student-scroll" style={{ maxHeight: '280rpx' }}>
          <View className="student-grid">
            {sortedStudents.map((student) => {
              const isActive = student.id === currentStudentId;
              const hasBirthday = isBirthday(student.birthday);

              return (
                <View
                  key={student.id}
                  className={`student-item ${isActive ? 'active' : ''} ${student.feedbackDone ? 'done' : 'pending'}`}
                  onClick={() => handleSelectStudent(student.id)}
                >
                  <View className="avatar-wrapper">
                    {student.avatar ? (
                      <Image className="avatar" src={student.avatar} mode="aspectFill" />
                    ) : (
                      <View
                        className="avatar-initial"
                        style={{ backgroundColor: getMorandiColor(student.name) }}
                      >
                        <Text>{student.name.charAt(student.name.length - 1)}</Text>
                      </View>
                    )}
                    {hasBirthday && (
                      <View className="birthday-badge">
                        <Text>🎂</Text>
                      </View>
                    )}
                    {isActive && (
                      <View className="edit-badge">
                        <Text style={{ fontSize: '16rpx' }}>✎</Text>
                      </View>
                    )}
                    {!student.feedbackDone && <View className="pending-dot" />}
                  </View>
                  <Text className="student-name">{student.name}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* 主内容区 */}
      <ScrollView className="main-content" scrollY>
        {/* 标题 */}
        <View className="section-header">
          <Text className="section-title">Today's Tasks</Text>
          <Text className="section-date">{getTodayStr()}</Text>
        </View>

        {/* 历史记录提示 */}
        {showHistoryHint && currentTasks.length > 0 && (
          <View className="history-hint">
            <View className="hint-icon">
              <Text>🕐</Text>
            </View>
            <Text className="hint-text">已经展示上次的反馈记录</Text>
          </View>
        )}

        {/* 作业列表 */}
        <View className="task-list">
          {currentTasks.map((task, index) => renderTaskCard(task, index))}

          {/* 添加新作业按钮 */}
          <View className="add-task-btn" onClick={() => setShowAddModal(true)}>
            <View className="add-icon">
              <Text>➕</Text>
            </View>
            <Text className="add-text">Add New Task</Text>
          </View>
        </View>

        {/* 底部占位 */}
        <View style={{ height: '300rpx' }} />
      </ScrollView>

      {/* 完成反馈按钮 */}
      <View className="footer-action">
        <View className="gradient-mask" />
        <View className="action-wrapper">
          <Button className="complete-btn" onClick={handleCompleteFeedback}>
            <Text style={{ marginRight: '16rpx' }}>💾</Text>
            Complete Feedback
          </Button>
        </View>
      </View>

      {/* 添加作业弹窗 */}
      {showAddModal && (
        <View className="modal-overlay">
          <View className="modal-backdrop" onClick={() => setShowAddModal(false)} />
          <View className="modal-container">
            <View className="modal-handle" />

            <View className="modal-header">
              <Text className="modal-title">Select from Task Bank</Text>
              <View className="btn-close" onClick={() => setShowAddModal(false)}>
                <Text>✕</Text>
              </View>
            </View>

            <View className="modal-search">
              <View className="search-box">
                <Text className="search-icon">🔍</Text>
                <Input
                  className="search-input"
                  placeholder="搜索作业或输入拼音缩写"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.detail.value)}
                />
              </View>
            </View>

            <ScrollView className="modal-list" scrollY>
              {filteredTaskBank.map((task) => {
                const isSelected = selectedTasks.includes(task.id);
                return (
                  <View
                    key={task.id}
                    className={`task-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleTaskSelection(task.id)}
                  >
                    <View className="task-option-left">
                      <View className={`task-icon ${isSelected ? 'active' : ''}`}>
                        <Text>{task.icon}</Text>
                      </View>
                      <View className="task-option-info">
                        <Text className="task-option-name">{task.name}</Text>
                        <Text className="task-option-subtitle">{task.subtitle}</Text>
                      </View>
                    </View>
                    <View className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Text style={{ color: '#102222', fontSize: '24rpx' }}>✓</Text>}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View className="modal-footer">
              <Button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                className="btn-confirm"
                onClick={handleAddSelectedTasks}
                disabled={selectedTasks.length === 0}
              >
                Add Selected ({selectedTasks.length})
              </Button>
            </View>
          </View>
        </View>
      )}

      <TabBar activeTab="feedback" />
    </View>
  );
};

export default Feedback;
