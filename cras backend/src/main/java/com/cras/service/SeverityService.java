package com.cras.service;

import org.springframework.stereotype.Service;


import com.cras.entity.Request;
import org.springframework.stereotype.Service;

@Service
public class SeverityService {

    public double calculateSeverity(Request request) {

        double populationScore =
                normalizePopulation(request.getPeopleAffected());

        double dangerScore =
                normalizeDanger(request.getPeopleInDanger());

        double criticalScore =
                normalizeCritical(request.getCriticalPeople());

        double durationScore =
                normalizeDuration(request.getHoursWithoutResource());

        double severity =
                (populationScore * 0.30) +
                        (dangerScore * 0.30) +
                        (criticalScore * 0.25) +
                        (durationScore * 0.15);

        return Math.round(severity * 100.0) / 100.0;
    }

    private double normalizePopulation(Integer people) {

        int value = safe(people);

        if (value <= 10) return 20;
        if (value <= 50) return 40;
        if (value <= 100) return 60;
        if (value <= 200) return 80;

        return 100;
    }

    private double normalizeDanger(Integer people) {

        int value = safe(people);

        if (value == 0) return 0;
        if (value <= 10) return 20;
        if (value <= 50) return 40;
        if (value <= 100) return 60;
        if (value <= 200) return 80;

        return 100;
    }

    private double normalizeCritical(Integer people) {

        int value = safe(people);

        if (value == 0) return 0;
        if (value <= 5) return 40;
        if (value <= 10) return 60;
        if (value <= 25) return 80;

        return 100;
    }

    private double normalizeDuration(Integer hours) {

        int value = safe(hours);

        if (value <= 2) return 20;
        if (value <= 6) return 40;
        if (value <= 12) return 60;
        if (value <= 24) return 80;

        return 100;
    }

    private int safe(Integer value) {
        if (value == null) {
            return 0;
        }

        return Math.max(0, value);
    }
}