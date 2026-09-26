package org.example.calculator.backend.service;

import org.example.calculator.backend.dto.DepositRequest;
import org.example.calculator.backend.dto.DepositResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class DepositService {

    private static final MathContext MC = new MathContext(20, RoundingMode.HALF_UP);

    public DepositResponse calculate(DepositRequest request) {
        BigDecimal amount = request.getAmount();
        BigDecimal rate = request.getRate();
        int months = request.getMonths();

        // Месячная ставка = Ставка / 100 / 12
        BigDecimal ratePerMonth = rate
                .divide(new BigDecimal("100"), MC)
                .divide(new BigDecimal("12"), MC);

        // База = 1 + ratePerMonth
        BigDecimal base = BigDecimal.ONE.add(ratePerMonth);

        // Итог = Сумма × base ^ months
        BigDecimal total = amount.multiply(base.pow(months, MC), MC);

        // Прибыль = Итог - Сумма
        BigDecimal profit = total.subtract(amount);

        // Округление до 2 знаков (копейки)
        total = total.setScale(2, RoundingMode.HALF_UP);
        profit = profit.setScale(2, RoundingMode.HALF_UP);

        return new DepositResponse(total, profit);
    }
}
