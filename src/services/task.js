import Taro from '@tarojs/taro';

const STORAGE_KEY = 'task_bank_data';

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

export const taskService = {
  getTasks() {
    try {
      const stored = Taro.getStorageSync(STORAGE_KEY);
      return stored && stored.length > 0 ? stored : DEFAULT_TASKS;
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks) {
    try {
      Taro.setStorageSync(STORAGE_KEY, tasks);
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  },

  getAllTasks() {
    return this.getTasks();
  },

  getActiveTasks() {
    return this.getTasks().filter((t) => t.isActive !== false);
  },
};
