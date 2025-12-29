import Taro from '@tarojs/taro';
import { studentService } from './student';

const ATTENDANCE_KEY_PREFIX = 'attendance_';

export const attendanceService = {
  // 生成今日的存储 Key，格式：attendance_YYYY-MM-DD
  getTodayKey() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    return `${ATTENDANCE_KEY_PREFIX}${dateStr}`;
  },

  // 保存今日考勤学生 ID 列表
  saveAttendance(studentIds) {
    try {
      const key = this.getTodayKey();
      Taro.setStorageSync(key, studentIds);
      return true;
    } catch (e) {
      console.error('Save attendance failed:', e);
      return false;
    }
  },

  // 获取今日考勤学生 ID 列表
  getTodayAttendanceIds() {
    try {
      const key = this.getTodayKey();
      const ids = Taro.getStorageSync(key);
      return ids || [];
    } catch (e) {
      console.error('Get attendance ids failed:', e);
      return [];
    }
  },

  // 获取今日考勤的完整学生信息列表
  getTodayAttendanceStudents() {
    const ids = this.getTodayAttendanceIds();
    if (!ids || ids.length === 0) {
      return [];
    }

    const allStudents = studentService.getStudents();
    // 保持 ID 列表的顺序（如果需要），或者仅仅筛选
    // 这里我们按照 ids 的顺序来返回学生对象，这样首页的排序能保留到反馈页
    const attendanceStudents = ids
      .map((id) => allStudents.find((s) => s.id === id))
      .filter((s) => s !== undefined); // 过滤掉可能已删除的学生

    return attendanceStudents;
  },
};
