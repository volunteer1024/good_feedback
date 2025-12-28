import { Button, Input, ScrollView, Switch, Text, Textarea, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import TabBar from '../../components/TabBar';
import './index.less';

const INITIAL_TRACKING_TYPES = [
  { id: 'not_completed', label: '未完成 (Not Completed)', disabled: true, checked: true },
  { id: 'completed', label: '完成 (Completed)' },
  { id: 'percentage', label: '百分比 (Percentage)' },
  { id: 'page_number', label: '页码 (Page Number)' },
];

const DEFAULT_TASKS = [
  {
    id: 1,
    title: 'Pinyin Reading Practice - Module 1',
    pinyin: 'pinyin reading practice',
    abbr: 'prp',
    duration: '15 mins',
    color: 'orange',
    icon: '📖',
    trackingTypes: ['not_completed'],
    details: '',
    remarks: '',
    isActive: true,
  },
  {
    id: 2,
    title: 'Addition/Subtraction within 20',
    pinyin: 'addition subtraction',
    abbr: 'as',
    duration: '10 mins',
    color: 'blue',
    icon: '🔢',
    trackingTypes: ['completed', 'percentage'],
    details: '',
    remarks: '',
    isActive: true,
  },
  {
    id: 3,
    title: 'Picture Storytelling: The Park',
    pinyin: 'picture storytelling',
    abbr: 'ps',
    duration: '25 mins',
    color: 'purple',
    icon: '📚',
    trackingTypes: ['not_completed'],
    details: '',
    remarks: '',
    isActive: true,
  },
  {
    id: 4,
    title: 'Hanzi Writing Practice - Basics',
    pinyin: 'hanzi writing',
    abbr: 'hw',
    duration: '20 mins',
    color: 'orange',
    icon: '✏️',
    trackingTypes: ['page_number'],
    details: '',
    remarks: '',
    isActive: true,
  },
  {
    id: 5,
    title: 'Daily Conversation Listening',
    pinyin: 'daily conversation',
    abbr: 'dc',
    duration: '12 mins',
    color: 'teal',
    icon: '🎧',
    trackingTypes: ['not_completed'],
    details: '',
    remarks: '',
    isActive: true,
  },
];

const STORAGE_KEY = 'task_bank_data';

const Task = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Custom Tracking Options State
  const [trackingOptions, setTrackingOptions] = useState(INITIAL_TRACKING_TYPES);
  const [customStatus, setCustomStatus] = useState('');

  // Load tasks from storage or use default
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = Taro.getStorageSync(STORAGE_KEY);
      return stored && stored.length > 0 ? stored : DEFAULT_TASKS;
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return DEFAULT_TASKS;
    }
  });

  // Save tasks to storage whenever they change
  useEffect(() => {
    try {
      Taro.setStorageSync(STORAGE_KEY, tasks);
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }, [tasks]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    trackingTypes: ['not_completed'], // Default
    details: '',
    remarks: '',
    isActive: true,
  });

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      // Filter by Search (Keyword + Pinyin Abbr)
      if (query) {
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchPinyin = task.pinyin && task.pinyin.includes(query);
        const matchAbbr = task.abbr && task.abbr.includes(query);
        return matchTitle || matchPinyin || matchAbbr;
      }
      return true;
    });
  }, [tasks, searchQuery]);

  const toggleTrackingType = (id) => {
    if (id === 'not_completed') return; // Cannot toggle disabled
    setFormData((prev) => {
      const current = prev.trackingTypes;
      if (current.includes(id)) {
        return { ...prev, trackingTypes: current.filter((t) => t !== id) };
      } else {
        return { ...prev, trackingTypes: [...current, id] };
      }
    });
  };

  const handleAddCustomStatus = () => {
    if (!customStatus.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newOption = { id: newId, label: customStatus };

    setTrackingOptions((prev) => [...prev, newOption]);
    setFormData((prev) => ({
      ...prev,
      trackingTypes: [...prev.trackingTypes, newId],
    }));
    setCustomStatus('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      trackingTypes: ['not_completed'],
      details: '',
      remarks: '',
      isActive: true,
    });
    setEditingTask(null);
    setTrackingOptions(INITIAL_TRACKING_TYPES); // Reset options too or keep them? Resetting for clean state
    setCustomStatus('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    // Prepare tracking options: merge initial ones with any custom ones this task might have
    // For simplicity in this demo, we just use initial types.
    // If task has custom types not in INITIAL_TRACKING_TYPES, we should add them.
    // Here we assume task.trackingTypes only contains known IDs for now, or we'd need to store custom labels in task data.
    // Since we don't store custom labels in task.trackingTypes (only IDs), we can't easily restore custom labels without changing data structure.
    // For this strict requirement, I'll stick to maintaining the flow.

    setFormData({
      title: task.title,
      trackingTypes: task.trackingTypes || ['not_completed'],
      details: task.details || '',
      remarks: task.remarks || '',
      isActive: task.isActive !== false,
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingTask) {
      // Update existing
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...formData } : t)));
    } else {
      // Add new
      const newTask = {
        id: Date.now(),
        ...formData,
        duration: '0 mins',
        color: 'gray',
        icon: '📝',
        pinyin: '',
        abbr: '',
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setShowAddModal(false);
    resetForm();
  };

  return (
    <View className="task-page">
      {/* Header */}
      <View className="header">
        <View className="btn-round" onClick={() => Taro.navigateBack()}>
          <Text style={{ fontSize: '44rpx', marginBottom: '4rpx' }}>‹</Text>
        </View>
        <Text className="title">Task Bank</Text>
        <View className="btn-round primary-light" onClick={handleOpenAdd}>
          <Text className="primary-text" style={{ fontSize: '44rpx' }}>
            +
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="search-section">
        <View className="search-box">
          <Text className="icon">🔍</Text>
          <Input
            className="input"
            placeholder="输入拼音缩写快速查找 (Enter Pinyin)"
            placeholderStyle="color: #9ca3af"
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.detail.value)}
          />
          <View className="shortcut">
            <Text>⌘K</Text>
          </View>
        </View>
      </View>

      {/* Library Header */}
      <View className="library-stats">
        <Text className="label">LIBRARY</Text>
        <Text className="count">{filteredTasks.length} Tasks</Text>
      </View>

      {/* Task List */}
      <ScrollView className="task-list" scrollY>
        {filteredTasks.map((task) => (
          <View className="task-card" key={task.id}>
            <View className={`icon-box ${task.color}`}>
              <Text style={{ fontSize: '40rpx' }}>{task.icon}</Text>
            </View>
            <View className="content">
              <Text className="task-title">{task.title}</Text>
              <View className="meta">
                <Text className="duration">{task.duration}</Text>
              </View>
            </View>
            <View className="btn-more" onClick={() => handleEditTask(task)}>
              <Text style={{ fontSize: '36rpx', fontWeight: 'bold' }}>⋮</Text>
            </View>
          </View>
        ))}

        {/* Create Prompt - Bottom of list style */}
        <View className="create-card" onClick={handleOpenAdd}>
          <View className="icon-circle">
            <Text style={{ fontSize: '40rpx' }}>+</Text>
          </View>
          <Text className="text">Create a new task</Text>
        </View>
      </ScrollView>

      {/* Modal */}
      {showAddModal && (
        <View className="modal-overlay">
          <View className="backdrop" onClick={() => setShowAddModal(false)} />
          <View className="modal-container">
            {/* Modal Header */}
            <View className="modal-header">
              <Text className="modal-title">{editingTask ? 'Edit Task' : 'New Task'}</Text>
              <View className="btn-close" onClick={() => setShowAddModal(false)}>
                <Text>✕</Text>
              </View>
            </View>

            {/* Modal Body */}
            <ScrollView className="modal-body" scrollY>
              {/* Task Name */}
              <View className="form-item">
                <Text className="label">TASK NAME</Text>
                <Input
                  className="input-field"
                  placeholder="e.g. Daily Pinyin Practice"
                  value={formData.title}
                  onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
                />
              </View>

              {/* Daily Progress */}
              <View className="form-item">
                <Text className="label">每日程度 (DAILY PROGRESS)</Text>
                <Text className="sub-label">Select applicable tracking metrics:</Text>

                <View className="checkbox-group">
                  {trackingOptions.map((type) => {
                    const isChecked = formData.trackingTypes.includes(type.id);
                    return (
                      <View
                        key={type.id}
                        className={`checkbox-item ${type.disabled ? 'disabled' : ''}`}
                        onClick={() => toggleTrackingType(type.id)}
                      >
                        <Text className="text">{type.label}</Text>
                        <View className={`checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Text style={{ color: '#fff', fontSize: '24rpx' }}>✓</Text>}
                        </View>
                      </View>
                    );
                  })}

                  {/* Custom Status Input */}
                  <View className="custom-status">
                    <Input
                      className="custom-input"
                      placeholder="Enter custom status..."
                      value={customStatus}
                      onInput={(e) => setCustomStatus(e.detail.value)}
                    />
                    <View className="custom-actions">
                      <View className="btn-text" onClick={() => setCustomStatus('')}>
                        Cancel
                      </View>
                      <View className="btn-small-primary" onClick={handleAddCustomStatus}>
                        Add Status
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Remarks (Merged Details) */}
              <View className="form-item">
                <Text className="label">备注 (REMARKS)</Text>
                <Textarea
                  className="textarea-field"
                  placeholder="Add instructions, goals, or notes..."
                  autoHeight
                  value={formData.remarks}
                  onInput={(e) => setFormData({ ...formData, remarks: e.detail.value })}
                />
              </View>

              {/* Deactivation */}
              <View className="switch-row">
                <Text className="label">停用状态 (DEACTIVATION STATUS)</Text>
                <Switch
                  checked={!formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: !e.detail.value })}
                  color="#137fec"
                />
              </View>

              {/* Modal Footer (Moved inside ScrollView) */}
              <View
                style={{
                  display: 'flex',
                  gap: '24rpx',
                  marginTop: '64rpx',
                  paddingBottom: '150rpx',
                }}
              >
                <Button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="btn-submit" onClick={handleSave}>
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      <TabBar activeTab="task" />
    </View>
  );
};

export default Task;
