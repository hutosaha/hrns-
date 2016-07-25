'use strict';

const filter = module.exports = {};

filter.findSelectedKeys = (query) => {
    let filterKeys = Object.keys(query).filter((key) => {
        return query[key] !== 'All'
    });
    return filterKeys;
}

filter.removeSalaryMinMax = (keys) => {
    let lessMinMax = keys.filter((ele) => {
        return ele !== 'salaryMin' && ele !== 'salaryMax';
    })
    return lessMinMax;
}

filter.checkCandidate = (candidate) => {
    for (var i = 0; i < filterKeyExcSalary.length; i++) {
        return candidate[filterKeyExcSalary[i]] === query[filterKeyExcSalary[i]] &&
            candidate[filterKeyExcSalary[i + 1]] === query[filterKeyExcSalary[i + 1]] &&
            candidate[filterKeyExcSalary[i + 2]] === query[filterKeyExcSalary[i + 2]] &&
            candidate[filterKeyExcSalary[i + 3]] === query[filterKeyExcSalary[i + 3]] &&
            candidate[filterKeyExcSalary[i + 4]] === query[filterKeyExcSalary[i + 4]]
    }
}

filter.convertSalaryToNumber = (salaryString) => {
    let salary = salaryString.split('£')[1].replace(/\,/g, '');
    salary = parseInt(salary);
    return salary;
}

filter.filterBySalaryMax = (array, query) => {
    let candidatesFiltered = array.filter((candidate) => {
        let salary = convertSalaryToNumber(candidate.salary);
        return salary <= query.salaryMax
    });
    return candidatesFiltered;
}

filter.filterBySalaryMin = (array, query) => {
    let candidatesFiltered = array.filter((candidate) => {
        let salary = convertSalaryToNumber(candidate.salary);
        return salary >= query.salaryMin
    })

    return candidatesFiltered;
}


filter.filterBySalaryRange = (array, query) => {
    let candidatesFiltered = array.filter((candidate) => {
        let salary = convertSalaryToNumber(candidate.salary);
        return salary >= query.salaryMin && salary <= query.salaryMax;
    })
    return candidatesFiltered;
}

filter.filtereredArray = (filterKeyExcSalaryLength, query) => {
    switch (true) {
        case (filterKeyExcSalaryLength === 0 && query.salaryMax !== 'All' && query.salaryMin === 'All'):
            return filterBySalaryMax(harnessTalentList, query)

        case (filterKeyExcSalaryLength > 0 && query.salaryMax !== 'All' && query.salaryMin === 'All'):
            return filterBySalaryMax(candidatesFilteredExcSalary, query);

        case (filterKeyExcSalaryLength === 0 && query.salaryMin !== 'All' && query.salaryMax === 'All'):
            return filterBySalaryMin(harnessTalentList, query);

        case (filterKeyExcSalaryLength > 0 && query.salaryMax === 'All' && query.salaryMin !== 'All'):
            return filterBySalaryMin(candidatesFilteredExcSalary, query);

        case (filterKeyExcSalaryLength === 0 && query.salaryMin !== 'All' && query.salaryMax !== 'All'):
            return filterBySalaryRange(harnessTalentList, query);

        case (filterKeyExcSalaryLength > 0 && query.salaryMin !== 'All' && query.salaryMax !== 'All'):
            return filterBySalaryRange(candidatesFilteredExcSalary, query);

        case (filterKeyExcSalaryLength > 0):
            return candidatesFilteredExcSalary;

        case (filterKeyExcSalaryLength === 0):
            return harnessTalentList;
    }
}
