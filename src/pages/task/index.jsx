import { Button, Input, Picker, ScrollView, Text, Textarea, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import './index.less';

const Task = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories] = useState(['Pinyin', 'Math', 'Reading', 'Creative', 'Listening']);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);

  // Dummy Data for Tasks
  const tasks = [
    {
      id: 1,
      title: 'Pinyin Reading Practice - Module 1',
      category: 'Language',
      duration: '15 mins',
      color: 'orange',
      icon: '📖',
    },
    {
      id: 2,
      title: 'Addition/Subtraction within 20',
      category: 'Math',
      duration: '10 mins',
      color: 'blue',
      icon: '🔢',
    },
    {
      id: 3,
      title: 'Picture Storytelling: The Park',
      category: 'Creative',
      duration: '25 mins',
      color: 'purple',
      icon: '📚',
    },
    {
      id: 4,
      title: 'Hanzi Writing Practice - Basics',
      category: 'Language',
      duration: '20 mins',
      color: 'orange',
      icon: '✏️',
    },
    {
      id: 5,
      title: 'Daily Conversation Listening',
      category: 'Listening',
      duration: '12 mins',
      color: 'teal',
      icon: '🎧',
    },
  ];

  const TaskCard = ({ task }) => (
    <View className="task-card">
      <View className={`icon-box ${task.color}`}>
        <Text>{task.icon}</Text>
      </View>
      <View className="card-content">
        <Text className="task-name">{task.title}</Text>
        <View className="meta-row">
          <View className={`tag ${task.color}`}>
            <Text>{task.category}</Text>
          </View>
          <Text className="duration">• {task.duration}</Text>
        </View>
      </View>
      <View className="btn-more">
        <Text>⋮</Text>
      </View>
    </View>
  );

  return (
    <View className="task-page">
      {/* Top App Bar */}
      <View className="header">
        <View className="btn-icon" onClick={() => Taro.navigateBack()}>
          <Text>‹</Text>
        </View>
        <Text className="title">Task Bank</Text>
        <View className="btn-icon btn-add" onClick={() => setShowAddModal(true)}>
          <Text>+</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="search-section">
        <View className="search-bar">
          <Text className="icon-search">🔍</Text>
          <Input
            className="search-input"
            placeholder="Search or type 'PY' for Pinyin"
            placeholderStyle="color: #9ca3af"
          />
          <View className="shortcut-hint">
            <Text>⌘K</Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View className="filter-section">
        {['All', 'Pinyin', 'Math', 'Reading', 'Creative'].map((filter) => (
          <View
            key={filter}
            className={`filter-chip ${activeFilter === filter ? 'active' : 'inactive'}`}
            onClick={() => setActiveFilter(filter)}
          >
            <Text>{filter}</Text>
          </View>
        ))}
      </View>

      {/* Main List */}
      <ScrollView className="task-list" scrollY>
        <View className="library-header">
          <Text className="section-title">Library</Text>
          <Text className="task-count">{tasks.length} Tasks</Text>
        </View>

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        <View className="create-prompt" onClick={() => setShowAddModal(true)}>
          <View className="prompt-icon">
            <Text>+</Text>
          </View>
          <Text className="prompt-text">Create a new task</Text>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      {showAddModal && (
        <View className="modal-overlay">
          <View className="backdrop" onClick={() => setShowAddModal(false)}></View>
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Task</Text>
              <View className="btn-close" onClick={() => setShowAddModal(false)}>
                <Text>✕</Text>
              </View>
            </View>

            <View className="modal-body">
              <View className="form-group">
                <Text className="label">Task Name</Text>
                <View className="input-wrapper">
                  <Input className="input-field" placeholder="e.g. Daily Pinyin Practice" />
                </View>
              </View>

              <View className="form-group">
                <Text className="label">Category</Text>
                <View className="input-wrapper">
                  <Picker
                    mode="selector"
                    range={categories}
                    onChange={(e) => setSelectedCategoryIndex(e.detail.value)}
                  >
                    <View
                      className="input-field select-field"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ color: selectedCategoryIndex === -1 ? '#9ca3af' : 'inherit' }}>
                        {selectedCategoryIndex === -1
                          ? 'Select a category'
                          : categories[selectedCategoryIndex]}
                      </Text>
                    </View>
                  </Picker>
                  <Text className="icon-suffix">⌄</Text>
                </View>
              </View>

              <View className="form-group">
                <Text className="label">Est. Time (Min)</Text>
                <View className="input-wrapper has-prefix">
                  <Text className="icon-prefix">⏰</Text>
                  <Input className="input-field" type="number" placeholder="20" />
                </View>
              </View>

              <View className="form-group">
                <Text className="label">Details</Text>
                <View className="input-wrapper">
                  <Textarea
                    className="input-field textarea-field"
                    placeholder="Add instructions, goals, or notes..."
                  />
                </View>
              </View>
            </View>

            <View className="modal-footer">
              <Button className="btn btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className="btn btn-submit" onClick={() => setShowAddModal(false)}>
                Add Task
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* Tab Bar */}
      <TabBar activeTab="task" />
    </View>
  );
};

export default Task;
