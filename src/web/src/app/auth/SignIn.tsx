function SignIn() {
  return (
    <form>
      <label htmlFor="email">
        <span>Email</span>
        <input type="text" id="email" />
      </label>
      <label htmlFor="password">
        <span>Password</span>
        <input type="text" id="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}

export { SignIn };
