import { Image, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import './index.less';

// Simple icons using characters or CSS
const IconCheck = () => <View className="check-mark"></View>;

const IconCalendar = () => <Text style={{ fontSize: '28rpx', marginRight: '8rpx' }}>📅</Text>;

const Index = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Alice M.',
      timeLeft: 10,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      selected: true,
    },
    {
      id: 2,
      name: 'Bob D.',
      timeLeft: 8,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      selected: false,
    },
    {
      id: 3,
      name: 'Charlie K.',
      timeLeft: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      selected: true,
      low: true,
    },
    {
      id: 4,
      name: 'Diana P.',
      timeLeft: 15,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      selected: false,
    },
    {
      id: 5,
      name: 'Evan R.',
      timeLeft: 3,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      selected: true,
      low: true,
    },
    {
      id: 6,
      name: 'Fiona G.',
      timeLeft: 12,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      selected: false,
    },
    {
      id: 7,
      name: 'George H.',
      timeLeft: 20,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      selected: false,
    },
  ]);

  const toggleSelect = (id) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)));
  };

  const selectAll = () => {
    const allSelected = students.every((s) => s.selected);
    setStudents((prev) => prev.map((s) => ({ ...s, selected: !allSelected })));
  };

  const handleComplete = () => {
    const selectedCount = students.filter((s) => s.selected).length;
    if (selectedCount === 0) {
      Taro.showToast({ title: 'Please select students', icon: 'none' });
      return;
    }
    Taro.showToast({
      title: 'Registration success',
      icon: 'success',
    });
  };

  const selectedCount = students.filter((s) => s.selected).length;

  return (
    <View className="attendance-page">
      <View className="header">
        <View className="header-top">
          <View className="title-group">
            <Text className="title">Today&apos;s Class</Text>
            <View className="subtitle">
              <IconCalendar />
              <Text>Oct 24, 2023</Text>
            </View>
          </View>
          <View className="select-all-btn" onClick={selectAll}>
            {students.every((s) => s.selected) ? 'Deselect All' : 'Select All'}
          </View>
        </View>
      </View>

      <ScrollView className="main-content" scrollY>
        <View className="student-grid">
          {students.map((student) => (
            <View
              key={student.id}
              className={`student-card ${student.selected ? 'active' : ''}`}
              onClick={() => toggleSelect(student.id)}
            >
              <View className={`check-icon ${student.selected ? 'checked' : ''}`}>
                {student.selected && <IconCheck />}
              </View>

              <View className="avatar-wrapper">
                <Image
                  className={`avatar ${student.selected ? (student.low ? 'ring-warning' : 'ring-active') : ''}`}
                  src={student.avatar}
                  mode="aspectFill"
                />
                {student.low && <View className="badge">Low</View>}
              </View>

              <View className="info">
                <Text className="name">{student.name}</Text>
                <Text className={`status ${student.low ? 'warning' : ''}`}>
                  {student.timeLeft} hrs left
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="add-student-btn">
          <Text style={{ marginRight: '10rpx' }}>+</Text>
          <Text>Add Student to Class</Text>
        </View>
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
