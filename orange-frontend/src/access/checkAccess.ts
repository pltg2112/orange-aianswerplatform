/**
 * 权限校验
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
import ACCESS_ENUM from '@/access/accessEnum'

const checkAccess = (loginUser: API.LoginUserVO, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN
  // 未登录就可访问
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }
  // 普通用户可访问
  if (needAccess === ACCESS_ENUM.USER) {
    return loginUserAccess !== ACCESS_ENUM.NOT_LOGIN ? true : false
  }
  // 管理员可访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    return loginUserAccess === ACCESS_ENUM.ADMIN ? true : false
  }
}

export default checkAccess
