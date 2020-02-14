import Cookies from 'js-cookie'

const TokenKey = 'CHANGGOU_TOKEN'
const userNameKey = 'username'
const avatarKey = 'avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  let in30Minutes = 1/48;
  var inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000)
  Cookies.set("token_expire_time",new Date(new Date().getTime() + 30 * 60 * 1000).getTime(),{ expires: 7 })
  console.log(new Date().getTime())
  return Cookies.set(TokenKey, token, {
    expires: inFifteenMinutes
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(userNameKey)
}

export function setUserName(useranme) {
  return Cookies.set(userNameKey, useranme)
}
export function getAvatar() {
  return Cookies.get(avatarKey)
}

export function setAvatar(avatar) {
  return Cookies.set(avatarKey, avatar)
}
