
import dayjs from 'dayjs';

export const execCommandCopy = (text: string) => {
  const input = document.createElement('input') as HTMLInputElement;
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export const htmlToDomElem = (html: string) => {
  let div = document.createElement('div');
  div.innerHTML = html.trim();

  return div
}

export const stringToDomElem = (string: string) => {
  return new DOMParser().parseFromString(string, 'text/html')
}

export const isImageUrl = (url: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageExtensions.test(url);
}

/**
 *
 * @param string : HTML 태그가 포함된 스트링
 * @returns 첫번째 돔 리턴
 */
export const getFirstDomElement = (string: string) => {
  if (!string.length) {
    throw 'Please, send a string with more than one character'
  }
  const div = document.createElement('div');
  div.innerHTML = string
  return div.firstElementChild
}

export const blobToFile = (blob: Blob, fileName?: string, fileType?: string) => {

  return new File([blob], fileName ?? 'no_file_name' + new Date().getTime(), {
    lastModified: new Date().getTime(),
    type: fileType ?? blob.type
  })
}

export const dateFormat = (sec: number | string) => {

  if (dayjs().diff(dayjs(sec), 'm') < 1) {
    return dayjs().diff(dayjs(sec), 's') + '초 전'
  } else if (dayjs().diff(dayjs(sec), 'h') < 1) {
    return dayjs().diff(dayjs(sec), 'm') + '분 전'
  } else if (dayjs().diff(dayjs(sec), 'd') < 1) {
    return dayjs().diff(dayjs(sec), 'h') + '시간 전'
  } else if (dayjs().diff(dayjs(sec), 'd') <= 7) {
    return dayjs().diff(dayjs(sec), 'd') + '일 전'
  } else {
    return dayjs(sec).locale('ko').format('MM월 DD일 ')
  }
}

export const enDateFormat = (sec: number | string) => {

  if (dayjs().diff(dayjs(sec), 'm') < 1) {
    return dayjs().diff(dayjs(sec), 's') + 'SECONDS AGO'
  } else if (dayjs().diff(dayjs(sec), 'h') < 1) {
    return dayjs().diff(dayjs(sec), 'm') + 'MINUTES AGO'
  } else if (dayjs().diff(dayjs(sec), 'd') < 1) {
    return dayjs().diff(dayjs(sec), 'h') + 'HOUR AGO'
  } else if (dayjs().diff(dayjs(sec), 'd') <= 7) {
    return dayjs().diff(dayjs(sec), 'd') + 'DAYS AGO'
  } else {
    return dayjs(sec).locale('en').format('MMMM DD ')
  }
}

export const numToKMB = (num: number) => {
  let result: any = num;

  if (num < 1000) {
    result = num;
  }
  else if (num >= 1000 && num < 1000000) {
    result = parseInt(String(num / 1000)) + 'K'
  }
  else if (num >= 1000000 && num < 1000000000) {
    result = parseInt(String(num / 1000000)) + 'M'
  }
  else if (num >= 1000000000 && num < 1000000000000) {
    result = parseInt(String(num / 1000000000)) + 'B'
  }
  else if (num >= 1000000000000) {
    result = parseInt(String(num / 1000000000000)) + 'T'
  }
  return result;
}

export const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=_-])[A-Za-z\d~!@#$%^&*()+|=_-]{6,20}$/
// (?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16
//[a-zA-Z0-9`~!@#$%^&*()-_=+\|[]{};:'",.<>/?]{8,24}

export const randomString = (count: number = 11) => {
  let str = Math.random().toString(36).substr(2, 11);
  while (str.length < count) {
    str += Math.random().toString(36).substr(2, 11);
  }
  return str.substr(0, count);
}


export const isEmpty = (str: string) => {

  if (typeof str == "undefined" || str == null || str == "") {
    return true
  } else {
    return false;
  }
}

export const isObjEmpty = (obj: Record<string, any>): Boolean => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}
