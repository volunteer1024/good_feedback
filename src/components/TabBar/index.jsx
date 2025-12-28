import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const TabBar = ({ activeTab = 'home' }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/pages/index/index' },
    { id: 'students', icon: '👥', label: 'Students', path: '/pages/students/index' },
    { id: 'feedback', icon: '💬', label: 'Feedback', path: '/pages/index/index' },
    { id: 'my', icon: '👤', label: 'My', path: '/pages/my/index' },
  ];

  const handleTabClick = (tab) => {
    if (tab.id === activeTab) return;
    Taro.reLaunch({ url: tab.path });
  };

  return (
    <View className="nav-bar">
      {tabs.map((tab) => (
        <View
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          <Text className="nav-icon" style={{ fontSize: '40rpx' }}>
            {tab.icon}
          </Text>
          <Text className="nav-label">{tab.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default TabBar;
