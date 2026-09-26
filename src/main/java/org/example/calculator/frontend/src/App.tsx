import { useState, FormEvent } from 'react';
import './App.css';

interface DepositRequest {
    amount: number;
    months: number;
    rate: number;
}

interface DepositResponse {
    total: number;
    profit: number;
}

interface ValidationErrors {
    [key: string]: string;
}

function App() {
    const [amount, setAmount] = useState<string>('100000');
    const [months, setMonths] = useState<string>('12');
    const [rate, setRate] = useState<string>('8');

    const [result, setResult] = useState<DepositResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validate = (): boolean => {
        const errors: ValidationErrors = {};
        const numAmount = parseFloat(amount);
        const numMonths = parseFloat(months);
        const numRate = parseFloat(rate);

        if (isNaN(numAmount) || numAmount < 1000 || numAmount > 10_000_000) {
            errors.amount = 'От 1 000 до 10 000 000';
        }
        if (isNaN(numMonths) || numMonths < 1 || numMonths > 60 || !Number.isInteger(numMonths)) {
            errors.months = 'Целое число от 1 до 60';
        }
        if (isNaN(numRate) || numRate < 1 || numRate > 20) {
            errors.rate = 'От 1 до 20';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!validate()) return;

        const requestData: DepositRequest = {
            amount: parseFloat(amount),
            months: parseInt(months, 10),
            rate: parseFloat(rate),
        };

        setIsLoading(true);
        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errData = await response.json();
                const message =
                    typeof errData === 'object' && errData !== null
                        ? Object.values(errData).join(', ')
                        : 'Ошибка при расчёте';
                throw new Error(message);
            }

            const data: DepositResponse = await response.json();
            setResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>💰 Калькулятор вклада</h2>

            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="amount">Сумма вклада (₽)</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1000"
                        max="10000000"
                        step="1000"
                        required
                    />
                    {fieldErrors.amount && (
                        <small style={{ color: '#c33' }}>{fieldErrors.amount}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="months">Срок (месяцы)</label>
                    <input
                        id="months"
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        min="1"
                        max="60"
                        step="1"
                        required
                    />
                    {fieldErrors.months && (
                        <small style={{ color: '#c33' }}>{fieldErrors.months}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="rate">Годовая ставка (%)</label>
                    <input
                        id="rate"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        min="1"
                        max="20"
                        step="0.1"
                        required
                    />
                    {fieldErrors.rate && (
                        <small style={{ color: '#c33' }}>{fieldErrors.rate}</small>
                    )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Расчёт...' : 'Рассчитать'}
                </button>
            </form>

            {result && (
                <div className="result">
                    <div className="result-row">
                        <span>Начальная сумма:</span>
                        <span>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="result-row">
                        <span>Итоговая сумма:</span>
                        <span>{formatCurrency(result.total)}</span>
                    </div>
                    <div className="result-row">
                        <span>Доход:</span>
                        <span>{formatCurrency(result.profit)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;