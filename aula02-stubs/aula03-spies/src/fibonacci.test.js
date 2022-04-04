const Fibonacci = require('./fibonacci');
const sinon = require('sinon');
const assert = require('assert')

(async () => {

    {
        const fibonacci = new Fibonacci()
        const spy = sinon.spy(fibonacci, fibonacci.execute.name)
        
        for await(const i of fibonacci.execute(3)){

        }

        const expectedCallCount = 4
        assert.deepStrictEqual(spy.callCount, expectedCallCount)
    }

})