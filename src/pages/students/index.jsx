import { Image, Input, ScrollView, Text, View } from '@tarojs/components';
import { useState } from 'react';
import TabBar from '../../components/TabBar';
import './index.less';

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [students] = useState([
    {
      id: '8821',
      name: 'Alex Johnson',
      status: 'In Class',
      remainingHours: 45,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCriGlcScux0AWlecnFDErXN0CLtNQtYXZOZVc-0eMz5gPuJgNjRlFuN7pkpT_VUzLaWESTFWSP5eepMlC8cg8d80aJbi80uGxx9mvU07ZqBm8XesCsDBZ34oilRdjoXdw7k3A7iNjRkHDOpG8ECHN3oBwfO7WnZansJhLhO_RJiN8nlo8nSB7TyZoK6QF6KOcjifKyW_BetSFs3BLrkTnuHI90eRIDDhYtMv__cK_pzEOdVEWhLNsQtzJCnLduSGPpx-TgO4_Ftg',
    },
    {
      id: '9932',
      name: 'Sarah Lee',
      status: 'Paused',
      remainingHours: 12,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcqA7JJcHpZ8k2zB9zbrrnW3MSAX6ciL51FoGv6trlB3LC01VEKVlqFVkERaMxkH-G2LlG-dYg_EH5gI4AxuSeDMf2XogEu4o_OI-tk-sjzK6wG4L3znoY_nt5-hwqxXXXdXjBN9xOy9iI-uhuszo3-5jTBs6HN0b4-ZZbFU6KEWgTb3N-KW8iDJbxp9M9T7bNlBtJfUOQer-skr5584IHAXPq2PdsaYS3FmPX0CKWtlz6NfWORhoArQVr7OwBoDIqgonThaATw',
    },
    {
      id: '7741',
      name: 'Michael Chen',
      status: 'In Class',
      remainingHours: 120,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBRxuRfCQF_oUz7Q9Qq8qZSL1doRdrfpymqwwvf3iYyey4GwotPTmrj3OMsCRyziOGkWGsw4vBp_t5UP7jFUkOlVCsnunM0w5qpz-ZLXwEqnRtXKuKxCb-3BByf-_K2fHQW8yVRosdoq6kImnXebq1Q7-O030SOmiH_3UQjDVCNbLZs-Doc-goeO_05yCaPkCjEyfoTJ8gOrgCjPBWLVZcJCgEN-J8-QycYFtQZ5pQYgx5aMDScKvAiNCYD9YiBd1wZB14Lx_tBkg',
    },
    {
      id: '5512',
      name: 'Emily Davis',
      status: 'Graduated',
      remainingHours: 0,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCjddw6EPL-bk0GUEu_LY6wOGEwKcUqZEt-hdrFnVdD8jJ-CO6aUVPBG0zPg2L8N-msdDXE8IRSYRig34M8d9vbHm0lbvZQulynn3BqZCH4AdalnzRptXguXbCo6U4CHkTUIXeuiZltZzKKxyPXnj7ntEvNxS_yxNslThs5_uZQJ7emVFbnqfMxuxGs013dq3IbjWZFx5KkToJxFUsbzzdrNYb37HnrL9dE0ovc9cLfp3mkCLjFXvIXjQQl3Z8zWLWZ-PwHcOlnRQ',
    },
    {
      id: '1029',
      name: 'James Rodriguez',
      status: 'In Class',
      remainingHours: 15,
      avatar: '',
    },
  ]);

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
    const charCode = name.charCodeAt(name.length - 1);
    return colors[charCode % colors.length];
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View className="students-page">
      <View className="sticky-header">
        <View className="header-top">
          <Text className="title">Student Management</Text>
          <View className="actions">
            <View className="btn-icon">
              <Text>🔔</Text>
            </View>
            <View className="btn-icon btn-primary">
              <Text>+</Text>
            </View>
          </View>
        </View>

        <View className="search-bar">
          <Text className="icon-search">🔍</Text>
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
        {filteredStudents.map((student) => (
          <View
            key={student.id}
            className={`student-card ${student.status === 'Graduated' ? 'is-graduated' : ''}`}
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
              <Text className="chevron">→</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TabBar activeTab="students" />
    </View>
  );
};

export default Students;
