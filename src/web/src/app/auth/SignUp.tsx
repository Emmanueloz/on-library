function SignUp() {
  return (
    <form>
      <label htmlFor="username">
        <span>Username</span>
        <input type="text" id="username" />
      </label>
      <label htmlFor="email">
        <span>Email</span>
        <input type="text" id="email" />
      </label>
      <label htmlFor="password">
        <span>Password</span>
        <input type="text" id="password" />
      </label>
      <label htmlFor="confirmPassword">
        <span>Confirm password</span>
        <input type="text" id="confirmPassword" />
      </label>
      <button>Sign Up</button>
    </form>
  );
}

export { SignUp };
