package com.exportpro.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AnalyticsResponse {
    private Map<String, Long> ordersByStatus;
        private List<SalesPoint> salesOverTime;
            private BigDecimal totalRevenue;
                private long totalOrders;
                    private long totalCars;

                        @Data
                            @AllArgsConstructor
                                public static class SalesPoint {
                                        private String date;
                                                private BigDecimal amount;
                                                    }
                                                    }