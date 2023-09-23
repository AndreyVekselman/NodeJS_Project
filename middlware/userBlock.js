function userBlock(isPasswordCorrect, user) {
  try {
    const currentDate = new Date();
    if (isPasswordCorrect && currentDate > user.nextAttempt) {
      user.attempts = 0;
      user.save();
      return false;
    } else {
      if (currentDate < user.nextAttempt) {
        return true;
      }
    }

    if (!isPasswordCorrect) {
      if (user.attempts < 2) {
        user.attempts++;
        user.save();
        return false;
      } else {
        const blockTime = new Date();
        blockTime.setHours(blockTime.getHours() + 24);
        user.nextAttempt = blockTime;
        user.save();
        return true;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = userBlock;
