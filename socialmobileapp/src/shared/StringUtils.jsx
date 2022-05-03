export class StringUtils {

  static parseDate(string) {
    const fields = string.split("/");
    const day = fields[0];
    const month = fields[1];
    const year = fields[2];

    return new Date(year,parseInt(month) - 1, day);
  }
}
