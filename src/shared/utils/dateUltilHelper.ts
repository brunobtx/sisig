export class DateUtils {
  static toDate(value: string | Date): Date {
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida')
    }
    return date
  }

  static isDateEqual(date1: string | Date, date2: string | Date): boolean {
    const d1 = this.toDate(date1)
    const d2 = this.toDate(date2)
    return d1.getTime() === d2.getTime()
  }

  static isBefore(date1: string | Date, date2: string | Date): boolean {
    const d1 = this.toDate(date1)
    const d2 = this.toDate(date2)
    return d1.getTime() < d2.getTime()
  }

  static isAfter(date1: string | Date, date2: string | Date): boolean {
    const d1 = this.toDate(date1)
    const d2 = this.toDate(date2)
    return d1.getTime() > d2.getTime()
  }
}
