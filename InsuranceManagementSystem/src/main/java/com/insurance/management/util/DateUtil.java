package com.insurance.management.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateUtil {
    private static final String DATE_PATTERN = "yyyy-MM-dd";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern(DATE_PATTERN);

    public static String format(LocalDate date) {
        return date != null ? date.format(FORMATTER) : null;
    }

    public static LocalDate parse(String dateStr) {
        return dateStr != null ? LocalDate.parse(dateStr, FORMATTER) : null;
    }
}
