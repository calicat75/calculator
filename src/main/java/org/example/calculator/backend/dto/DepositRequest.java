package org.example.calculator.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DepositRequest {

    @NotNull(message = "Сумма вклада обязательна")
    @DecimalMin(value = "1000.00", message = "Сумма должна быть не менее 1000")
    @DecimalMax(value = "10000000.00", message = "Сумма не может превышать 10 000 000")
    private BigDecimal amount;

    @NotNull(message = "Срок вклада обязателен")
    @DecimalMin(value = "1", message = "Срок должен быть не менее 1 месяца")
    @DecimalMax(value = "60", message = "Срок не может превышать 60 месяцев")
    private Integer months;

    @NotNull(message = "Процентная ставка обязательна")
    @DecimalMin(value = "1.0", message = "Ставка должна быть не менее 1%")
    @DecimalMax(value = "20.0", message = "Ставка не может превышать 20%")
    private BigDecimal rate;

    public DepositRequest() {}

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getMonths() { return months; }
    public void setMonths(Integer months) { this.months = months; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }
}
