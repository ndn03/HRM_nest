import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface ISchedule {
  start: Date;
  end: Date;
}

interface IDayWithIndex {
  dayNumber: number;
  date: Date;
}

/**
 * Trả về ngày bắt đầu sớm nhất trong danh sách các khoảng thời gian (schedule).
 *
 * @param dates - Danh sách các khoảng thời gian, mỗi khoảng gồm ngày bắt đầu và ngày kết thúc.
 * @returns Ngày bắt đầu sớm nhất hoặc null nếu mảng rỗng.
 *
 * Giải thích:
 * - Hàm sẽ sort danh sách theo start date từ sớm → muộn.
 * - Lấy phần tử đầu tiên làm ngày sớm nhất.
 */
export function getEarliestStartDate(dates: ISchedule[]): Date | null {
  if (dates.length === 0) {
    return null;
  }
  dates.sort((a, b) => (dayjs(a.start).isBefore(dayjs(b.start)) ? -1 : 1));
  return dayjs(dates[0].start).toDate();
}

/**
 * Tạo danh sách các ngày cùng số thứ tự (index) nằm trong tất cả các schedule truyền vào.
 *
 * @param schedules - Danh sách schedules, mỗi schedule chứa start và end.
 * @returns Mảng các phần tử gồm:
 *  - dayNumber: số thứ tự ngày (1, 2, 3...)
 *  - date: đối tượng Date tương ứng
 *
 * Giải thích:
 * - Lặp từng schedule, sinh từng ngày từ start → end.
 * - Mỗi ngày được gán một index tăng dần.
 * - Cuối cùng sort theo ngày tăng dần để đảm bảo đúng thứ tự thời gian.
 *
 * Ứng dụng:
 * - Render lịch theo ngày.
 * - Tính công / tính giờ / timeline.
 */
export function generateDaysWithIndex(schedules: ISchedule[]): IDayWithIndex[] {
  const allDays: IDayWithIndex[] = [];
  let dayCounter = 1;

  if (schedules?.length <= 0) return [];

  schedules.forEach((schedule) => {
    const startDate = dayjs(schedule.start);
    const endDate = dayjs(schedule.end);
    let currentDate = startDate;

    // Lặp từng ngày từ start đến end (bao gồm end)
    while (currentDate.isSameOrBefore(endDate)) {
      allDays.push({
        dayNumber: dayCounter,
        date: currentDate.toDate(),
      });
      currentDate = currentDate.add(1, 'day');
      dayCounter++;
    }
  });

  // Sort theo mốc thời gian từ sớm → muộn
  allDays.sort((a, b) => (dayjs(a.date).isBefore(b.date) ? -1 : 1));

  return allDays;
}

/**
 * Đếm số ngày nghỉ (leaveDays) nằm trong một khoảng thời gian schedule.
 *
 * @param schedules - Khoảng thời gian cần kiểm tra (start, end).
 * @param leaveDays - Danh sách các ngày nghỉ.
 * @returns Số ngày nghỉ nằm trong khoảng thời gian đó.
 *
 * Giải thích:
 * - Sử dụng dayjs để kiểm tra từng ngày nghỉ có nằm giữa start và end hay không.
 * - Điều kiện: day >= start AND day <= end.
 */
export function countLeaveDaysInRange(
  schedules: ISchedule,
  leaveDays: Date[],
): number {
  if (leaveDays?.length < 0) return 0;

  const count = leaveDays.filter((day) => {
    return (
      dayjs(day).isSameOrAfter(schedules.start) &&
      dayjs(day).isSameOrBefore(schedules.end)
    );
  }).length;

  return count;
}
