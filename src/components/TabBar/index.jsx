import { Text, View } from '@tarojs/components'
import './index.less'

const TabBar = ({ activeTab = 'home' }) => {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
    { id: 'settings', icon: '⚙', label: 'Settings' }
  ]

  return (
    <View className='nav-bar'>
      {tabs.map(tab => (
        <View 
          key={tab.id} 
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
        >
          <View style={{ fontSize: '40rpx' }}>{tab.icon}</View>
          <Text className='nav-label'>{tab.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default TabBar
