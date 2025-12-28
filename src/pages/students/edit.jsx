import { Image, Input, Picker, Text, Textarea, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { studentService } from '../../services/student';
import './edit.less';

const StudentEdit = () => {
  const { params } = useRouter();
  const isEdit = !!params.id;

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

  useEffect(() => {
    if (isEdit) {
      const student = studentService.getStudentById(params.id);
      if (student) {
        setFormData({
          ...student,
          remainingHours: student.remainingHours.toString(),
          feeStandard: (student.feeStandard || '').toString(),
        });
      }
    }
  }, [isEdit, params.id]);

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
    if (isEdit) {
      success = studentService.updateStudent({ ...data, id: params.id });
    } else {
      const newStudent = studentService.addStudent(data);
      success = !!newStudent;
    }

    if (success) {
      Taro.showToast({ title: isEdit ? 'Updated' : 'Added', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1500);
    }
  };

  const handleCancel = () => {
    Taro.navigateBack();
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

  return (
    <View className="student-edit-page">
      <View className="header">
        <View className="back-btn" onClick={handleCancel}>
          <Text className="material-symbols-outlined">arrow_back</Text>
        </View>
        <Text className="title">{isEdit ? 'Edit Student' : 'New Student'}</Text>
        <View className="placeholder" />
      </View>

      <View className="content">
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
              <Text className="material-symbols-outlined icon-add">add_a_photo</Text>
            )}
          </View>
          <View className="upload-hint">
            <Text className="main">Upload Avatar</Text>
            <Text className="sub">Auto-generated if empty</Text>
          </View>
        </View>

        <View className="form-group">
          <View className="label-row">
            <Text className="label">Full Name</Text>
          </View>
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
                handleInputChange('gender', ['Select', 'Female', 'Male', 'Other'][e.detail.value])
              }
            >
              <View className="input-box picker-box">
                <Text>{formData.gender}</Text>
                <Text className="material-symbols-outlined" style={{ fontSize: '32rpx' }}>
                  expand_more
                </Text>
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
                <Text className="material-symbols-outlined" style={{ fontSize: '32rpx' }}>
                  calendar_today
                </Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className="h-px bg-gray-100 my-4" />

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
      </View>

      <View className="footer-actions">
        <View className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </View>
        <View className="btn btn-submit" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : 'Add Student'}
        </View>
      </View>
    </View>
  );
};

export default StudentEdit;
