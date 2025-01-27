import ModulusChecker from '../src';
import { ModulusWeight } from '../src/interfaces';
import { CheckType } from '../src/enums';

describe('ModulusChecker', () => {
    let checker: ModulusChecker;

    beforeEach(() => {
        checker = new ModulusChecker();
    });

    describe('modulusCheck', () => {
        const exampleWeights: ModulusWeight = {
            start: 499272,
            end: 499273,
            check_type: CheckType.DBLAL,
            exception: null,
            weights: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
        };

        test('should pass example 1 from Vocalink spec', () => {
            const result = checker.modulusCheck(exampleWeights, '499273', '12345678');
            expect(result).toBe(true);
        });

        test('should fail example 1 from Vocalink spec with 1 increment', () => {
            const result = checker.modulusCheck(exampleWeights, '499273', '1234569');
            expect(result).toBe(false);
        });

        test('should pass example 2 from Vocalink spec', () => {
            const exampleWeights: ModulusWeight = {
                start: 0,
                end: 1,
                check_type: CheckType.MOD11,
                exception: null,
                weights: [0, 0, 0, 0, 0, 0, 7, 5, 8, 3, 4, 6, 2, 1],
            };
            const result = checker.modulusCheck(exampleWeights, '000000', '58177632');
            expect(result).toBe(true);
        });
    });

    describe('isValid', () => {
        // Custom tests
        test('should return false for a length 7 sort code', () => {
            const isValid = checker.validate('1234567', '12345678');
            expect(isValid).toBe(false);
        });

        test('should return false for a length 11 account number', () => {
            const isValid = checker.validate('000000', '12345678910');
            expect(isValid).toBe(false);
        });

        test('should return false for a non-numeric sort code', () => {
            const isValid = checker.validate('12345a', '12345678');
            expect(isValid).toBe(false);
        });

        // Vocalink spec tests

        // Comment indicates the test number from page 71, here
        // https://www.vocalink.com/media/a2febq5m/validating-account-numbers-uk-modulus-checking-v7-90.pdf
        // not passing for 23, 27, 28, which are all expected failures according to the spec.
        
        const vocalinkSpecTests = [

            { sortCode: '089999', accountNumber: '66374958', expectedResult: true }, // 1  
            { sortCode: '107999', accountNumber: '88837491', expectedResult: true }, // 2
            { sortCode: '202959', accountNumber: '63748472', expectedResult: true }, // 3
            { sortCode: '871427', accountNumber: '46238510', expectedResult: true }, // 4
            { sortCode: '872427', accountNumber: '46238510', expectedResult: true }, // 5
            { sortCode: '871427', accountNumber: '09123496', expectedResult: true }, // 6
            { sortCode: '871427', accountNumber: '99123496', expectedResult: true }, // 7
            { sortCode: '820000', accountNumber: '73688637', expectedResult: true }, // 8
            { sortCode: '827999', accountNumber: '73988638', expectedResult: true }, // 9
            { sortCode: '827101', accountNumber: '28748352', expectedResult: true }, // 10
            { sortCode: '134020', accountNumber: '63849203', expectedResult: true }, // 11
            { sortCode: '118765', accountNumber: '64371389', expectedResult: true }, // 12
            { sortCode: '200915', accountNumber: '41011166', expectedResult: true }, // 13
            { sortCode: '938611', accountNumber: '07806039', expectedResult: true }, // 14
            { sortCode: '938600', accountNumber: '42368003', expectedResult: true }, // 15
            { sortCode: '938063', accountNumber: '55065200', expectedResult: true }, // 16
            { sortCode: '772798', accountNumber: '99345694', expectedResult: true }, // 17
            { sortCode: '086090', accountNumber: '06774744', expectedResult: true }, // 18
            { sortCode: '309070', accountNumber: '02355688', expectedResult: true }, // 19
            { sortCode: '309070', accountNumber: '12345668', expectedResult: true }, // 20
            { sortCode: '309070', accountNumber: '12345677', expectedResult: true }, // 21
            { sortCode: '309070', accountNumber: '99345694', expectedResult: true }, // 22
            { sortCode: '938063', accountNumber: '15764264', expectedResult: false }, // 24
            { sortCode: '938063', accountNumber: '15763217', expectedResult: false }, // 25
            { sortCode: '118765', accountNumber: '64371388', expectedResult: false }, // 26
            { sortCode: '089999', accountNumber: '66374959', expectedResult: false }, // 29
            { sortCode: '107999', accountNumber: '88837493', expectedResult: false }, // 30
            { sortCode: '074456', accountNumber: '12345112', expectedResult: true }, // 31
            { sortCode: '070116', accountNumber: '34012583', expectedResult: true }, // 32
            { sortCode: '074456', accountNumber: '11104102', expectedResult: true }, // 33
            { sortCode: '180002', accountNumber: '00000190', expectedResult: true }, // 34
        ];

        vocalinkSpecTests.forEach(({ sortCode, accountNumber, expectedResult }, index) => {
            test(`Vocalink spec test ${index + 1}`, () => {
                const isValid = checker.validate(sortCode, accountNumber);
                expect(isValid).toBe(expectedResult);
            });
        });
    });
});