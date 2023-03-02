const emailEegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

const isEmail = (email: string) => {
  return emailEegex.test(email)
}

export default isEmail
