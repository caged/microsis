/**
 * Modify the details of the employee.
 * @param {object} employee The employee.
 * @param {object} newDetails
 * @config {string} [title] The new job title.
 * @config {number} salary The new salary.
 */
function modify(employee, newDetails) {
    if (newDetails.title != undefined)  employee.title = newDetails.title;
    if (newDetails.salary != undefined) employee.salary = newDetails.salary;
}