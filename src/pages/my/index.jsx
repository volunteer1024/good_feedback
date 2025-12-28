import { Image, ScrollView, Text, View } from '@tarojs/components';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import { studentService } from '../../services/student';
import './index.less';

const My = () => {
  const [students] = useState(() => {
    const allStudents = studentService.getStudents();
    return allStudents.filter((s) => s.remainingHours <= 3 && s.status !== 'Graduated');
  });

  const getMorandiColor = (name) => {
    const colors = [
      '#A3B18A',
      '#ADC178',
      '#DDE5B6',
      '#F0EAD6',
      '#A2D2FF',
      '#BDE0FE',
      '#FFC8DD',
      '#FFAFCC',
      '#FFB703',
      '#8E9AAF',
    ];
    const charCode = (name || 'A').charCodeAt((name || 'A').length - 1);
    return colors[charCode % colors.length];
  };

  return (
    <View className="my-page">
      <View className="header">
        <View className="title">
          <Text className="title-icon">▦</Text>
          <Text>My Studio</Text>
        </View>
        <Image className="avatar" src="https://via.placeholder.com/72" mode="aspectFill" />
      </View>

      <ScrollView className="content" scrollY>
        {/* Statistics Section */}
        <View className="section">
          <View className="section-header">
            <Text className="section-icon">📊</Text>
            <Text className="section-title">Overview</Text>
          </View>
          <View className="stats-grid">
            <View className="stat-card">
              <Text className="stat-label">Today</Text>
              <Text className="stat-value">
                4.5<Text className="stat-unit">h</Text>
              </Text>
            </View>
            <View className="stat-card">
              <Text className="stat-label">Last Week</Text>
              <Text className="stat-value">
                28<Text className="stat-unit">h</Text>
              </Text>
            </View>
            <View className="stat-card">
              <Text className="stat-label">Last Month</Text>
              <Text className="stat-value">
                112<Text className="stat-unit">h</Text>
              </Text>
            </View>
            <View className="stat-card">
              <Text className="stat-label">Last Year</Text>
              <Text className="stat-value">
                1.2k<Text className="stat-unit">h</Text>
              </Text>
            </View>
          </View>
        </View>
        {/* Renewal Warning Section */}
        {students.length > 0 && (
          <View className="section">
            <View className="warning-header">
              <View className="warning-title">
                <Text className="warning-icon">⚠</Text>
                <Text>Renewal Needed</Text>
              </View>
              <Text className="warning-badge">≤ 3 classes</Text>
            </View>
            <View className="warning-list">
              {students.map((student) => (
                <View key={student.id} className="warning-item">
                  {student.avatar ? (
                    <Image className="student-avatar" src={student.avatar} mode="aspectFill" />
                  ) : (
                    <View
                      className="student-avatar"
                      style={{
                        backgroundColor: getMorandiColor(student.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '28rpx',
                        fontWeight: 'bold',
                      }}
                    >
                      {student.name.charAt(student.name.length - 1).toUpperCase()}
                    </View>
                  )}
                  <View className="student-info">
                    <Text className="student-name">{student.name}</Text>
                    <Text className="student-meta">
                      {student.nickname ? `${student.nickname} • ` : ''}
                      {student.status}
                    </Text>
                  </View>
                  <View
                    className={`hours-badge ${student.remainingHours <= 1 ? 'critical' : 'warning'}`}
                  >
                    <Text className="badge-icon">{student.remainingHours <= 1 ? '📌' : '🔔'}</Text>
                    <Text className="badge-text">{student.remainingHours} left</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Utility Links */}
        <View className="section">
          <View className="utility-list">
            <View className="utility-item">
              <Text className="utility-text">Studio Settings</Text>
              <Text className="utility-icon">›</Text>
            </View>
            <View className="utility-item">
              <Text className="utility-text">Billing & Invoices</Text>
              <Text className="utility-icon">›</Text>
            </View>
            <View className="utility-item">
              <Text className="utility-text danger">Log out</Text>
              <Text className="utility-icon" style={{ fontSize: '28rpx' }}>
                🚪
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TabBar activeTab="my" />
    </View>
  );
};

export default My;
