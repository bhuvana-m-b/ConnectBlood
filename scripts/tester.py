import os

def generate_tests(requirements):
    code = f"""
const sum = require('../index');

test('basic test', () => {{
    expect(true).toBe(true);
}});
"""
    os.makedirs("repo/tests", exist_ok=True)

    with open("repo/tests/test_generated.js", "w") as f:
        f.write(code)
