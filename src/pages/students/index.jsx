import { Image, Input, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import { studentService } from '../../services/student';
import './index.less';

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [students, setStudents] = useState([]);

  useDidShow(() => {
    loadStudents();
  });

  const loadStudents = () => {
    const data = studentService.getStudents();
    setStudents(data);
  };

  const filters = ['All', 'In Class', 'Paused', 'Graduated'];

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Class':
        return 'in-class';
      case 'Paused':
        return 'paused';
      case 'Graduated':
        return 'graduated';
      default:
        return '';
    }
  };

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

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddStudent = () => {
    Taro.navigateTo({ url: '/pages/students/edit' });
  };

  const handleEditStudent = (id) => {
    Taro.navigateTo({ url: `/pages/students/edit?id=${id}` });
  };

  return (
    <View className="students-page">
      <View className="sticky-header">
        <View className="header-top">
          <Text className="title">Student Management</Text>
          <View className="actions">
            <View className="btn-icon">
              <Text className="material-symbols-outlined" style={{ fontSize: '44rpx' }}>
                notifications
              </Text>
            </View>
            <View className="btn-icon btn-primary" onClick={handleAddStudent}>
              <Text
                className="material-symbols-outlined"
                style={{ fontSize: '44rpx', color: '#fff' }}
              >
                add
              </Text>
            </View>
          </View>
        </View>

        <View className="search-bar">
          <Text
            className="material-symbols-outlined"
            style={{ fontSize: '40rpx', color: '#999', marginRight: '16rpx' }}
          >
            search
          </Text>
          <Input
            className="search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.detail.value)}
          />
        </View>
      </View>

      <View className="filter-tabs">
        {filters.map((f) => (
          <View
            key={f}
            className={`tab ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </View>
        ))}
      </View>

      <ScrollView className="student-list" scrollY>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <View
              key={student.id}
              className={`student-card ${student.status === 'Graduated' ? 'is-graduated' : ''}`}
              onClick={() => handleEditStudent(student.id)}
            >
              <View className="card-left">
                {student.avatar ? (
                  <Image className="avatar" src={student.avatar} mode="aspectFill" />
                ) : (
                  <View
                    className="initial-avatar"
                    style={{ backgroundColor: getMorandiColor(student.name) }}
                  >
                    {student.name.charAt(student.name.length - 1).toUpperCase()}
                  </View>
                )}

                <View className="student-info">
                  <Text className="name">{student.name}</Text>
                  <View className="meta">
                    <Text className={`status-badge ${getStatusClass(student.status)}`}>
                      {student.status}
                    </Text>
                    <Text className="student-id">ID: #{student.id}</Text>
                  </View>
                </View>
              </View>

              <View className="card-right">
                <View className="remaining">
                  <Text className="hours">{student.remainingHours} hrs</Text>
                  <Text className="label">Remaining</Text>
                </View>
                <Text className="material-symbols-outlined chevron">chevron_right</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="empty-state">
            <Text
              className="material-symbols-outlined"
              style={{ fontSize: '100rpx', color: '#eee', marginBottom: '20rpx' }}
            >
              person_off
            </Text>
            <Text style={{ color: '#999', fontSize: '28rpx' }}>No students found</Text>
          </View>
        )}
      </ScrollView>

      <TabBar activeTab="students" />
    </View>
  );
};

export default Students;
