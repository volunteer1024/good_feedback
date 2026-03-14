import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const TabBar = ({ activeTab = 'home' }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/pages/index/index' },
    { id: 'feedback', icon: '💬', label: 'Feedback', path: '/pages/feedback/index' },
    { id: 'task', icon: '📋', label: 'Task', path: '/pages/task/index' },
    { id: 'students', icon: '👥', label: 'Students', path: '/pages/students/index' },
    { id: 'my', icon: '👤', label: 'My', path: '/pages/my/index' },
  ];

  const handleTabClick = (tab) => {
    if (tab.id === activeTab) return;
    Taro.reLaunch({ url: tab.path });
  };

  return (
    <View className="tab-bar">
      {tabs.map((tab) => (
        <View
          key={tab.id}
          className={`tab-bar__item ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          <Text className="tab-bar__icon" style={{ fontSize: '40rpx' }}>
            {tab.icon}
          </Text>
          <Text className="tab-bar__label">{tab.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default TabBar;
