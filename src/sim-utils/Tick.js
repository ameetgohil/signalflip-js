function* Tick() {
    yield () => { return false };
    yield () => { return true };
}

module.exports = Tick;
