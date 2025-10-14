declare module 'jalaliday' {
  import { PluginFunc } from 'dayjs';
  
  declare const plugin: PluginFunc;
  export default plugin;
}

declare module 'dayjs' {
  interface Dayjs {
    calendar(name: string): Dayjs;
    jYear(year: number): Dayjs;
    jMonth(month: number): Dayjs;
    jDate(date: number): Dayjs;
  }
}