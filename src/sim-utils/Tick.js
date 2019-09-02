function* Tick() {
  let state = true;
  yield () => { state = !state;
		return state; };
}

module.exports = Tick;
