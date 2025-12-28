import Taro from '@tarojs/taro';

const STORAGE_KEY = 'STUDENTS_DATA';

const defaultStudents = [
  {
    id: '8821',
    name: 'Alex Johnson',
    nickname: 'Alex',
    status: 'In Class',
    remainingHours: 45,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCriGlcScux0AWlecnFDErXN0CLtNQtYXZOZVc-0eMz5gPuJgNjRlFuN7pkpT_VUzLaWESTFWSP5eepMlC8cg8d80aJbi80uGxx9mvU07ZqBm8XesCsDBZ34oilRdjoXdw7k3A7iNjRkHDOpG8ECHN3oBwfO7WnZansJhLhO_RJiN8nlo8nSB7TyZoK6QF6KOcjifKyW_BetSFs3BLrkTnuHI90eRIDDhYtMv__cK_pzEOdVEWhLNsQtzJCnLduSGPpx-TgO4_Ftg',
  },
  {
    id: '9932',
    name: 'Sarah Lee',
    nickname: 'Sarah',
    status: 'Paused',
    remainingHours: 12,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcqA7JJcHpZ8k2zB9zbrrnW3MSAX6ciL51FoGv6trlB3LC01VEKVlqFVkERaMxkH-G2LlG-dYg_EH5gI4AxuSeDMf2XogEu4o_OI-tk-sjzK6wG4L3znoY_nt5-hwqxXXXdXjBN9xOy9iI-uhuszo3-5jTBs6HN0b4-ZZbFU6KEWgTb3N-KW8iDJbxp9M9T7bNlBtJfUOQer-skr5584IHAXPq2PdsaYS3FmPX0CKWtlz6NfWORhoArQVr7OwBoDIqgonThaATw',
  },
  {
    id: '7741',
    name: 'Michael Chen',
    nickname: 'Michael',
    status: 'In Class',
    remainingHours: 120,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRxuRfCQF_oUz7Q9Qq8qZSL1doRdrfpymqwwvf3iYyey4GwotPTmrj3OMsCRyziOGkWGsw4vBp_t5UP7jFUkOlVCsnunM0w5qpz-ZLXwEqnRtXKuKxCb-3BByf-_K2fHQW8yVRosdoq6kImnXebq1Q7-O030SOmiH_3UQjDVCNbLZs-Doc-goeO_05yCaPkCjEyfoTJ8gOrgCjPBWLVZcJCgEN-J8-QycYFtQZ5pQYgx5aMDScKvAiNCYD9YiBd1wZB14Lx_tBkg',
  },
  {
    id: '5512',
    name: 'Emily Davis',
    nickname: 'Emily',
    status: 'Graduated',
    remainingHours: 0,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjddw6EPL-bk0GUEu_LY6wOGEwKcUqZEt-hdrFnVdD8jJ-CO6aUVPBG0zPg2L8N-msdDXE8IRSYRig34M8d9vbHm0lbvZQulynn3BqZCH4AdalnzRptXguXbCo6U4CHkTUIXeuiZltZzKKxyPXnj7ntEvNxS_yxNslThs5_uZQJ7emVFbnqfMxuxGs013dq3IbjWZFx5KkToJxFUsbzzdrNYb37HnrL9dE0ovc9cLfp3mkCLjFXvIXjQQl3Z8zWLWZ-PwHcOlnRQ',
  },
];

export const studentService = {
  getStudents: () => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEY);
      if (!data) {
        Taro.setStorageSync(STORAGE_KEY, defaultStudents);
        return defaultStudents;
      }
      return data;
    } catch (e) {
      console.error('Error reading students', e);
      return [];
    }
  },

  addStudent: (student) => {
    try {
      const students = studentService.getStudents();
      const newStudent = {
        ...student,
        id: Math.random().toString(36).substr(2, 4).toUpperCase(),
        status: student.status || 'In Class',
      };
      const updated = [newStudent, ...students];
      Taro.setStorageSync(STORAGE_KEY, updated);
      return newStudent;
    } catch (e) {
      console.error('Error adding student', e);
      return null;
    }
  },

  updateStudent: (student) => {
    try {
      const students = studentService.getStudents();
      const updated = students.map((s) => (s.id === student.id ? student : s));
      Taro.setStorageSync(STORAGE_KEY, updated);
      return true;
    } catch (e) {
      console.error('Error updating student', e);
      return false;
    }
  },

  getStudentById: (id) => {
    const students = studentService.getStudents();
    return students.find((s) => s.id === id);
  },
};
