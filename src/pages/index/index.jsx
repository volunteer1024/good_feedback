import { Image, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import { attendanceService } from '../../services/attendance';
import { studentService } from '../../services/student';
import './index.less';

// Simple icons using characters or CSS
const IconCheck = () => <View className="check-mark" />;

const IconCalendar = () => <Text style={{ fontSize: '28rpx', marginRight: '8rpx' }}>📅</Text>;

// 获取莫兰迪色系背景色
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

// 获取今天的日期
const getTodayStr = () => {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();
  return `${month} ${day}, ${year}`;
};

const Index = () => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useDidShow(() => {
    loadData();
  });

  const loadData = () => {
    const allStudents = studentService.getStudents();
    // 只显示 In Class 状态的学生
    const inClassStudents = allStudents.filter((s) => s.status === 'In Class');
    setStudents(inClassStudents);

    // 尝试获取今日已保存的考勤
    const savedIds = attendanceService.getTodayAttendanceIds();
    if (savedIds && savedIds.length > 0) {
      // 过滤掉可能已不在 In Class 列表中的 ID
      const validSavedIds = savedIds.filter((id) => inClassStudents.some((s) => s.id === id));
      setSelectedIds(validSavedIds);
    } else {
      // 默认全选
      setSelectedIds(inClassStudents.map((s) => s.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      }
      return [...prev, id];
    });
  };

  const selectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  const handleComplete = () => {
    if (selectedIds.length === 0) {
      Taro.showToast({ title: 'Please select students', icon: 'none' });
      return;
    }

    // 保存考勤数据
    attendanceService.saveAttendance(selectedIds);

    // 跳转到反馈页面，不再传递参数，直接跳转
    Taro.navigateTo({
      url: '/pages/feedback/index',
    });
  };

  const handleAddStudent = () => {
    Taro.navigateTo({ url: '/pages/students/index' });
  };

  const selectedCount = selectedIds.length;
  const allSelected = students.length > 0 && selectedIds.length === students.length;

  return (
    <View className="attendance-page">
      <View className="header">
        <View className="header-top">
          <View className="title-group">
            <Text className="title">Today's Class</Text>
            <View className="subtitle">
              <IconCalendar />
              <Text>{getTodayStr()}</Text>
            </View>
          </View>
          <View className="select-all-btn" onClick={selectAll}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </View>
        </View>
      </View>

      <ScrollView className="main-content" scrollY>
        {students.length === 0 ? (
          <View className="empty-state">
            <Text style={{ fontSize: '80rpx', marginBottom: '20rpx' }}>👥</Text>
            <Text style={{ color: '#999', fontSize: '28rpx', marginBottom: '40rpx' }}>
              No students in class
            </Text>
            <View className="add-student-btn" onClick={handleAddStudent}>
              <Text style={{ marginRight: '10rpx' }}>+</Text>
              <Text>Add Student to Class</Text>
            </View>
          </View>
        ) : (
          <>
            <View className="student-grid">
              {students.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                const isLowHours = student.remainingHours <= 5;

                return (
                  <View
                    key={student.id}
                    className={`student-card ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleSelect(student.id)}
                  >
                    <View className={`check-icon ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <IconCheck />}
                    </View>

                    <View className="avatar-wrapper">
                      {student.avatar ? (
                        <Image
                          className={`avatar ${isSelected ? (isLowHours ? 'ring-warning' : 'ring-active') : ''}`}
                          src={student.avatar}
                          mode="aspectFill"
                        />
                      ) : (
                        <View
                          className={`avatar-initial ${isSelected ? (isLowHours ? 'ring-warning' : 'ring-active') : ''}`}
                          style={{ backgroundColor: getMorandiColor(student.name) }}
                        >
                          <Text>{student.name.charAt(student.name.length - 1)}</Text>
                        </View>
                      )}
                      {isLowHours && <View className="badge">Low</View>}
                    </View>

                    <View className="info">
                      <Text className="name">{student.name}</Text>
                      <Text className={`status ${isLowHours ? 'warning' : ''}`}>
                        {student.remainingHours} hrs left
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="add-student-btn" onClick={handleAddStudent}>
              <Text style={{ marginRight: '10rpx' }}>+</Text>
              <Text>Add Student to Class</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View className="bottom-action">
        <View className="register-btn" onClick={handleComplete}>
          <Text className="btn-text">Complete Registration</Text>
          <View className="count-badge">{selectedCount} Selected</View>
          <Text style={{ marginLeft: '10rpx' }}>→</Text>
        </View>
      </View>

      <TabBar activeTab="home" />
    </View>
  );
};

export default Index;
