// 이미지 받아오기
export default function GetIcon(iconName) {
  // 업로드된 이미지가 data URL 형태인 경우
  if (typeof iconName === "string" && iconName.startsWith("data:image")) {
    return iconName;
  }
  // 로컬 경로의 이미지인 경우
  return process.env.PUBLIC_URL + "/" + iconName;
}
