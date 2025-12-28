import { Icon, Image, Input, Picker, ScrollView, Text, Textarea, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import { studentService } from '../../services/student';
import './index.less';

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [students, setStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    gender: 'Select',
    birthday: '',
    remainingHours: '',
    feeStandard: '',
    remarks: '',
    avatar: '',
  });

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
    setEditingStudent(null);
    setFormData({
      name: '',
      nickname: '',
      gender: 'Select',
      birthday: '',
      remainingHours: '',
      feeStandard: '',
      remarks: '',
      avatar: '',
    });
    setShowEditModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      ...student,
      remainingHours: student.remainingHours.toString(),
      feeStandard: (student.feeStandard || '').toString(),
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      Taro.showToast({ title: 'Name is required', icon: 'none' });
      return;
    }

    const data = {
      ...formData,
      remainingHours: parseInt(formData.remainingHours || '0'),
      feeStandard: parseFloat(formData.feeStandard || '0'),
    };

    let success = false;
    if (editingStudent) {
      success = studentService.updateStudent({ ...data, id: editingStudent.id });
    } else {
      const newStudent = studentService.addStudent(data);
      success = !!newStudent;
    }

    if (success) {
      Taro.showToast({ title: editingStudent ? 'Updated' : 'Added', icon: 'success' });
      handleCloseModal();
      loadStudents();
    }
  };

  return (
    <View className="students-page">
      <View className="sticky-header">
        <View className="header-top">
          <Text className="title">Student Management</Text>
          <View className="actions">
            <View className="btn-icon">
              <Text style={{ fontSize: '40rpx' }}>🔔</Text>
            </View>
            <View className="btn-icon btn-primary" onClick={handleAddStudent}>
              <Text style={{ fontSize: '40rpx', color: '#fff' }}>+</Text>
            </View>
          </View>
        </View>

        <View className="search-bar">
          <View style={{ marginRight: '16rpx', display: 'flex', alignItems: 'center' }}>
            <Icon type="search" size="18" color="#999" />
          </View>
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
              onClick={() => handleEditStudent(student)}
            >
              <View className="card-top">
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
                <Text style={{ color: '#ccc', fontSize: '40rpx' }}>›</Text>
              </View>

              <View className="card-bottom">
                <View>
                  <Text className="hours">{student.remainingHours} hrs</Text>
                </View>
                <Text className="label">Remaining</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="empty-state">
            <Text style={{ fontSize: '80rpx', marginBottom: '20rpx' }}>👤</Text>
            <Text style={{ color: '#999', fontSize: '28rpx' }}>No students found</Text>
          </View>
        )}
      </ScrollView>

      {showEditModal && (
        <View className="modal-overlay" onClick={handleCloseModal}>
          <View className="modal-container" onClick={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">{editingStudent ? 'Edit Student' : 'New Student'}</Text>
              <View className="modal-close" onClick={handleCloseModal}>
                <Text style={{ fontSize: '40rpx', color: '#999' }}>×</Text>
              </View>
            </View>

            <ScrollView className="modal-content" scrollY>
              <View className="avatar-upload">
                <View className="avatar-box">
                  {formData.avatar ? (
                    <Image src={formData.avatar} className="avatar-img" mode="aspectFill" />
                  ) : formData.name ? (
                    <View
                      className="avatar-img"
                      style={{
                        backgroundColor: getMorandiColor(formData.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '60rpx',
                        fontWeight: 'bold',
                      }}
                    >
                      {formData.name.charAt(formData.name.length - 1).toUpperCase()}
                    </View>
                  ) : (
                    <Text style={{ fontSize: '60rpx' }}>📷</Text>
                  )}
                </View>
                <View className="upload-hint">
                  <Text className="main">Upload Avatar</Text>
                  <Text className="sub">Auto-generated if empty</Text>
                </View>
              </View>

              <View className="form-group">
                <Text className="label">Full Name</Text>
                <Input
                  className="input-box"
                  placeholder="e.g. Alice Johnson"
                  value={formData.name}
                  onInput={(e) => handleInputChange('name', e.detail.value)}
                />
              </View>

              <View className="form-group">
                <View className="label-row">
                  <Text className="label">Nickname</Text>
                  <Text className="sub-label">For feedback images</Text>
                </View>
                <Input
                  className="input-box"
                  placeholder="e.g. Alice"
                  value={formData.nickname}
                  onInput={(e) => handleInputChange('nickname', e.detail.value)}
                />
              </View>

              <View className="grid-2">
                <View className="form-group">
                  <Text className="label">Gender</Text>
                  <Picker
                    mode="selector"
                    range={['Select', 'Female', 'Male', 'Other']}
                    value={['Select', 'Female', 'Male', 'Other'].indexOf(formData.gender)}
                    onChange={(e) =>
                      handleInputChange(
                        'gender',
                        ['Select', 'Female', 'Male', 'Other'][e.detail.value],
                      )
                    }
                  >
                    <View className="input-box picker-box">
                      <Text>{formData.gender}</Text>
                      <Text style={{ fontSize: '30rpx', color: '#ccc' }}>▾</Text>
                    </View>
                  </Picker>
                </View>

                <View className="form-group">
                  <Text className="label">Birthday</Text>
                  <Picker
                    mode="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.detail.value)}
                  >
                    <View className="input-box picker-box">
                      <Text>{formData.birthday || 'Select'}</Text>
                      <Text style={{ fontSize: '30rpx' }}>📅</Text>
                    </View>
                  </Picker>
                </View>
              </View>

              <View style={{ height: '2rpx', backgroundColor: '#f0f0f0', margin: '32rpx 0' }} />

              <View className="grid-2">
                <View className="form-group">
                  <Text className="label">Remaining Hours</Text>
                  <View className="input-wrapper">
                    <Input
                      className="input-box"
                      type="number"
                      placeholder="0"
                      value={formData.remainingHours}
                      onInput={(e) => handleInputChange('remainingHours', e.detail.value)}
                    />
                    <Text className="unit">Hrs</Text>
                  </View>
                </View>

                <View className="form-group">
                  <Text className="label">Fee Standard</Text>
                  <View className="input-wrapper has-prefix">
                    <Text className="prefix">$</Text>
                    <Input
                      className="input-box"
                      type="digit"
                      placeholder="0.00"
                      value={formData.feeStandard}
                      onInput={(e) => handleInputChange('feeStandard', e.detail.value)}
                    />
                    <Text className="unit" style={{ fontSize: '18rpx' }}>
                      / Sess
                    </Text>
                  </View>
                </View>
              </View>

              <View className="form-group">
                <Text className="label">Remarks</Text>
                <Textarea
                  className="input-box textarea-box"
                  placeholder="Additional notes about the student..."
                  value={formData.remarks}
                  onInput={(e) => handleInputChange('remarks', e.detail.value)}
                />
              </View>
            </ScrollView>

            <View className="modal-footer">
              <View className="btn btn-cancel" onClick={handleCloseModal}>
                Cancel
              </View>
              <View className="btn btn-submit" onClick={handleSubmit}>
                {editingStudent ? 'Save Changes' : 'Add Student'}
              </View>
            </View>
          </View>
        </View>
      )}

      <TabBar activeTab="students" />
    </View>
  );
};

export default Students;
