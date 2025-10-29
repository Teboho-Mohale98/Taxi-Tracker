// ========================================
// Data Storage
// ========================================
class DataStore {
    constructor() {
        this.drivers = this.loadData('drivers') || [];
        this.dailyEntries = this.loadData('dailyEntries') || [];
        this.maintenance = this.loadData('maintenance') || [];
        this.weeklyFees = this.loadData('weeklyFees') || [];
        this.currentWeekStart = this.getStartOfWeek(new Date());
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    }

    getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
        return new Date(d.setDate(diff));
    }

    getEndOfWeek(startDate) {
        const end = new Date(startDate);
        end.setDate(end.getDate() + 6);
        return end;
    }
}

const dataStore = new DataStore();

// ========================================
// Utility Functions
// ========================================
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
    return 'R ' + parseFloat(amount).toFixed(2);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA');
}

function formatDateInput(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========================================
// Screen Navigation
// ========================================
function switchScreen(screenId, navButton) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    document.getElementById(screenId).classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (navButton) {
        navButton.classList.add('active');
    }

    // Refresh screen content
    if (screenId === 'dashboard-screen') refreshDashboard();
    if (screenId === 'drivers-screen') renderDriversList();
    if (screenId === 'daily-entries-screen') {
        populateDriverDropdowns();
        renderRecentEntries();
    }
    if (screenId === 'maintenance-screen') {
        populateMaintenanceTaxiDropdown();
        renderMaintenanceList();
    }
    if (screenId === 'reports-screen') renderReports();
}

// ========================================
// Modal Management
// ========================================
function showDialog(dialogId) {
    document.getElementById(dialogId).classList.add('active');
}

function closeDialog(dialogId) {
    document.getElementById(dialogId).classList.remove('active');
}

// ========================================
// Driver Management
// ========================================
function showAddDriverDialog() {
    document.getElementById('add-driver-form').reset();
    showDialog('add-driver-dialog');
}

function saveDriver(event) {
    event.preventDefault();

    const driver = {
        id: generateId(),
        name: document.getElementById('driver-name').value,
        taxiNumber: document.getElementById('taxi-number').value,
        totalKm: parseFloat(document.getElementById('total-km').value),
        lastServiceKm: parseFloat(document.getElementById('last-service-km').value),
        isActive: true,
        createdAt: new Date().toISOString()
    };

    dataStore.drivers.push(driver);
    dataStore.saveData('drivers', dataStore.drivers);

    closeDialog('add-driver-dialog');
    renderDriversList();
    showNotification('Driver added successfully!');
}

function showEditDriverDialog(driverId) {
    const driver = dataStore.drivers.find(d => d.id === driverId);
    if (!driver) return;

    document.getElementById('edit-driver-id').value = driver.id;
    document.getElementById('edit-driver-name').value = driver.name;
    document.getElementById('edit-taxi-number').value = driver.taxiNumber;
    document.getElementById('edit-total-km').value = driver.totalKm;
    document.getElementById('edit-last-service-km').value = driver.lastServiceKm;

    showDialog('edit-driver-dialog');
}

function updateDriver(event) {
    event.preventDefault();

    const driverId = document.getElementById('edit-driver-id').value;
    const driver = dataStore.drivers.find(d => d.id === driverId);

    if (driver) {
        driver.name = document.getElementById('edit-driver-name').value;
        driver.taxiNumber = document.getElementById('edit-taxi-number').value;
        driver.totalKm = parseFloat(document.getElementById('edit-total-km').value);
        driver.lastServiceKm = parseFloat(document.getElementById('edit-last-service-km').value);

        dataStore.saveData('drivers', dataStore.drivers);
        closeDialog('edit-driver-dialog');
        renderDriversList();
        showNotification('Driver updated successfully!');
    }
}

function deleteDriver(driverId) {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    const index = dataStore.drivers.findIndex(d => d.id === driverId);
    if (index !== -1) {
        dataStore.drivers[index].isActive = false;
        dataStore.saveData('drivers', dataStore.drivers);
        renderDriversList();
        showNotification('Driver deleted successfully!');
    }
}

function markAsServiced(driverId) {
    const driver = dataStore.drivers.find(d => d.id === driverId);
    if (driver) {
        driver.lastServiceKm = driver.totalKm;
        dataStore.saveData('drivers', dataStore.drivers);
        renderDriversList();
        refreshDashboard();
        showNotification('Vehicle marked as serviced!');
    }
}

function isServiceDue(driver) {
    return (driver.totalKm - driver.lastServiceKm) >= 10000;
}

function kmUntilService(driver) {
    return 10000 - (driver.totalKm - driver.lastServiceKm);
}

function renderDriversList() {
    const driversList = document.getElementById('drivers-list');
    const activeDrivers = dataStore.drivers.filter(d => d.isActive);

    if (activeDrivers.length === 0) {
        driversList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>No drivers added yet. Click "Add Driver" to get started.</p>
            </div>
        `;
        return;
    }

    driversList.innerHTML = activeDrivers.map(driver => {
        const serviceDue = isServiceDue(driver);
        const kmLeft = kmUntilService(driver);

        return `
            <div class="driver-card">
                ${serviceDue ? '<div class="service-badge">Service Due</div>' : ''}
                <div class="driver-avatar">${driver.name.charAt(0).toUpperCase()}</div>
                <div class="driver-info">
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-details">Taxi: ${driver.taxiNumber}</div>
                    <div class="driver-km">Total KM: ${driver.totalKm.toLocaleString()} km</div>
                    <div class="driver-km" style="color: ${serviceDue ? 'var(--warning-color)' : 'var(--text-secondary)'}">
                        ${serviceDue ? 'Service overdue!' : `${Math.max(0, kmLeft).toFixed(0)} km until service`}
                    </div>
                </div>
                <div class="driver-actions">
                    ${serviceDue ? `<button class="mark-serviced-btn" onclick="markAsServiced('${driver.id}')">Mark Serviced</button>` : ''}
                    <button class="icon-btn" onclick="showEditDriverDialog('${driver.id}')" title="Edit">✏️</button>
                    <button class="icon-btn" onclick="deleteDriver('${driver.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// Daily Entries Management
// ========================================
function populateDriverDropdowns() {
    const activeDrivers = dataStore.drivers.filter(d => d.isActive);
    const select = document.getElementById('entry-driver');

    select.innerHTML = '<option value="">Select Driver</option>' +
        activeDrivers.map(d => `<option value="${d.id}" data-taxi="${d.taxiNumber}">${d.name} - ${d.taxiNumber}</option>`).join('');
}

function addDailyEntry(event) {
    event.preventDefault();

    const driverId = document.getElementById('entry-driver').value;
    const driver = dataStore.drivers.find(d => d.id === driverId);

    if (!driver) {
        showNotification('Please select a driver', 'error');
        return;
    }

    const entry = {
        id: generateId(),
        driverId: driver.id,
        driverName: driver.name,
        taxiNumber: driver.taxiNumber,
        date: document.getElementById('entry-date').value,
        cashBrought: parseFloat(document.getElementById('entry-cash-brought').value),
        amountMade: parseFloat(document.getElementById('entry-amount').value),
        fuelCost: parseFloat(document.getElementById('entry-fuel-cost').value),
        fuelType: document.getElementById('entry-fuel-type').value,
        notes: document.getElementById('entry-notes').value,
        createdAt: new Date().toISOString()
    };

    dataStore.dailyEntries.push(entry);
    dataStore.saveData('dailyEntries', dataStore.dailyEntries);

    document.getElementById('daily-entry-form').reset();
    document.getElementById('entry-date').valueAsDate = new Date();
    renderRecentEntries();
    showNotification('Entry added successfully!');
}

function deleteDailyEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    const index = dataStore.dailyEntries.findIndex(e => e.id === entryId);
    if (index !== -1) {
        dataStore.dailyEntries.splice(index, 1);
        dataStore.saveData('dailyEntries', dataStore.dailyEntries);
        renderRecentEntries();
        showNotification('Entry deleted successfully!');
    }
}

function renderRecentEntries() {
    const entriesList = document.getElementById('recent-entries-list');
    const recentEntries = dataStore.dailyEntries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    if (recentEntries.length === 0) {
        entriesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No entries yet. Add your first daily entry above.</p>
            </div>
        `;
        return;
    }

    entriesList.innerHTML = recentEntries.map(entry => {
        const netProfit = entry.amountMade - entry.fuelCost;
        const cashBrought = entry.cashBrought || 0;
        return `
            <div class="entry-item">
                <div class="entry-info">
                    <h4>${entry.driverName} - ${entry.taxiNumber}</h4>
                    <div class="entry-details">Date: ${formatDate(entry.date)}</div>
                    <div class="entry-details"><strong>Cash Brought In: ${formatCurrency(cashBrought)}</strong></div>
                    <div class="entry-details">Amount Made: ${formatCurrency(entry.amountMade)} | Fuel: ${formatCurrency(entry.fuelCost)} (${entry.fuelType})</div>
                    <div class="entry-details" style="color: ${netProfit >= 0 ? 'var(--success-color)' : 'var(--error-color)'}">
                        Net Profit: ${formatCurrency(netProfit)}
                    </div>
                    ${entry.notes ? `<div class="entry-details">Notes: ${entry.notes}</div>` : ''}
                </div>
                <div class="entry-actions">
                    <button class="icon-btn" onclick="deleteDailyEntry('${entry.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Auto-calculate net profit
document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('entry-amount');
    const fuelInput = document.getElementById('entry-fuel-cost');
    const netProfitInput = document.getElementById('entry-net-profit');

    function calculateNetProfit() {
        const amount = parseFloat(amountInput.value) || 0;
        const fuel = parseFloat(fuelInput.value) || 0;
        const net = amount - fuel;
        netProfitInput.value = formatCurrency(net);
        netProfitInput.style.color = net >= 0 ? 'var(--success-color)' : 'var(--error-color)';
    }

    amountInput.addEventListener('input', calculateNetProfit);
    fuelInput.addEventListener('input', calculateNetProfit);
});

// ========================================
// Maintenance Management
// ========================================
function populateMaintenanceTaxiDropdown() {
    const activeDrivers = dataStore.drivers.filter(d => d.isActive);
    const select = document.getElementById('maintenance-taxi');

    select.innerHTML = '<option value="">Select Taxi</option>' +
        activeDrivers.map(d => `<option value="${d.id}" data-taxi="${d.taxiNumber}">${d.taxiNumber} - ${d.name}</option>`).join('');
}

function showAddMaintenanceDialog() {
    document.getElementById('add-maintenance-form').reset();
    document.getElementById('maintenance-date').valueAsDate = new Date();
    showDialog('add-maintenance-dialog');
}

function saveMaintenance(event) {
    event.preventDefault();

    const taxiId = document.getElementById('maintenance-taxi').value;
    const driver = dataStore.drivers.find(d => d.id === taxiId);

    if (!driver) {
        showNotification('Please select a taxi', 'error');
        return;
    }

    const maintenance = {
        id: generateId(),
        taxiId: driver.id,
        taxiNumber: driver.taxiNumber,
        type: document.getElementById('maintenance-type').value,
        cost: parseFloat(document.getElementById('maintenance-cost').value),
        date: document.getElementById('maintenance-date').value,
        notes: document.getElementById('maintenance-notes').value,
        createdAt: new Date().toISOString()
    };

    dataStore.maintenance.push(maintenance);
    dataStore.saveData('maintenance', dataStore.maintenance);

    closeDialog('add-maintenance-dialog');
    renderMaintenanceList();
    showNotification('Maintenance record added successfully!');
}

function deleteMaintenance(maintenanceId) {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;

    const index = dataStore.maintenance.findIndex(m => m.id === maintenanceId);
    if (index !== -1) {
        dataStore.maintenance.splice(index, 1);
        dataStore.saveData('maintenance', dataStore.maintenance);
        renderMaintenanceList();
        showNotification('Maintenance record deleted successfully!');
    }
}

function renderMaintenanceList() {
    const maintenanceList = document.getElementById('maintenance-list');

    if (dataStore.maintenance.length === 0) {
        maintenanceList.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state-icon">🔧</div>
                    <p>No maintenance records yet. Click "Add Maintenance" to get started.</p>
                </div>
            </div>
        `;
        return;
    }

    // Group by month
    const grouped = {};
    dataStore.maintenance.forEach(m => {
        const date = new Date(m.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(m);
    });

    // Sort months descending
    const sortedMonths = Object.keys(grouped).sort().reverse();

    maintenanceList.innerHTML = sortedMonths.map(monthKey => {
        const items = grouped[monthKey].sort((a, b) => new Date(b.date) - new Date(a.date));
        const monthTotal = items.reduce((sum, item) => sum + item.cost, 0);
        const [year, month] = monthKey.split('-');
        const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        return `
            <div class="card maintenance-group">
                <h3>${monthName}</h3>
                ${items.map(item => `
                    <div class="maintenance-item">
                        <div class="maintenance-header">
                            <span class="maintenance-type">${item.type} - ${item.taxiNumber}</span>
                            <span class="maintenance-cost">${formatCurrency(item.cost)}</span>
                        </div>
                        <div class="maintenance-details">Date: ${formatDate(item.date)}</div>
                        ${item.notes ? `<div class="maintenance-details">Notes: ${item.notes}</div>` : ''}
                        <button class="icon-btn" onclick="deleteMaintenance('${item.id}')" title="Delete" style="margin-top: 10px;">🗑️ Delete</button>
                    </div>
                `).join('')}
                <div class="monthly-total">Monthly Total: ${formatCurrency(monthTotal)}</div>
            </div>
        `;
    }).join('');
}

// ========================================
// Dashboard
// ========================================
function refreshDashboard() {
    const activeDrivers = dataStore.drivers.filter(d => d.isActive);
    const serviceDueCount = activeDrivers.filter(d => isServiceDue(d)).length;

    // Get current week entries
    const weekStart = dataStore.getStartOfWeek(new Date());
    const weekEnd = dataStore.getEndOfWeek(weekStart);

    const weekEntries = dataStore.dailyEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const weekMaintenance = dataStore.maintenance.filter(m => {
        const maintenanceDate = new Date(m.date);
        return maintenanceDate >= weekStart && maintenanceDate <= weekEnd;
    });

    const totalEarnings = weekEntries.reduce((sum, e) => sum + e.amountMade, 0);
    const totalFuel = weekEntries.reduce((sum, e) => sum + e.fuelCost, 0);
    const totalMaintenance = weekMaintenance.reduce((sum, m) => sum + m.cost, 0);
    const netProfit = totalEarnings - totalFuel - totalMaintenance;

    // Update stats
    document.getElementById('active-drivers-count').textContent = activeDrivers.length;
    document.getElementById('service-due-count').textContent = serviceDueCount;
    document.getElementById('total-earnings').textContent = formatCurrency(totalEarnings);
    document.getElementById('total-fuel').textContent = formatCurrency(totalFuel);
    document.getElementById('total-maintenance').textContent = formatCurrency(totalMaintenance);

    const netProfitElement = document.getElementById('net-profit');
    netProfitElement.textContent = formatCurrency(netProfit);
    netProfitElement.className = 'stat-value ' + (netProfit >= 0 ? 'success' : 'error');

    // Render weekly chart
    renderWeeklyChart(weekStart, weekEnd);

    // Service reminders
    renderServiceReminders(activeDrivers.filter(d => isServiceDue(d)));
}

let weeklyChart = null;

function renderWeeklyChart(weekStart, weekEnd) {
    const canvas = document.getElementById('weekly-chart');
    const ctx = canvas.getContext('2d');

    // Get daily data for the week
    const days = [];
    const earnings = [];
    const current = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
        const dayEntries = dataStore.dailyEntries.filter(e => {
            const entryDate = new Date(e.date);
            return entryDate.toDateString() === current.toDateString();
        });

        const dayEarnings = dayEntries.reduce((sum, e) => sum + e.amountMade, 0);

        days.push(current.toLocaleDateString('en-US', { weekday: 'short' }));
        earnings.push(dayEarnings);

        current.setDate(current.getDate() + 1);
    }

    if (weeklyChart) {
        weeklyChart.destroy();
    }

    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Daily Earnings (R)',
                data: earnings,
                backgroundColor: 'rgba(255, 215, 0, 0.6)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R' + value;
                        }
                    }
                }
            }
        }
    });
}

function renderServiceReminders(serviceDueDrivers) {
    const card = document.getElementById('service-reminders-card');
    const list = document.getElementById('service-reminders-list');

    if (serviceDueDrivers.length === 0) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';
    list.innerHTML = serviceDueDrivers.map(driver => `
        <div class="service-reminder-item">
            <div class="service-reminder-header">
                <div class="reminder-info">
                    <h4>${driver.name} - ${driver.taxiNumber}</h4>
                    <p>Service overdue! Total KM: ${driver.totalKm.toLocaleString()} km</p>
                    <p>Last service: ${driver.lastServiceKm.toLocaleString()} km</p>
                </div>
                <button class="mark-serviced-btn" onclick="markAsServiced('${driver.id}')">Mark Serviced</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// Reports
// ========================================
function renderReports() {
    updateWeekRange();
    calculateWeeklySummary();
    renderDriverBreakdown();
}

function updateWeekRange() {
    const start = dataStore.currentWeekStart;
    const end = dataStore.getEndOfWeek(start);
    document.getElementById('current-week-range').textContent =
        `${formatDate(start)} - ${formatDate(end)}`;
}

function previousWeek() {
    dataStore.currentWeekStart.setDate(dataStore.currentWeekStart.getDate() - 7);
    renderReports();
}

function nextWeek() {
    dataStore.currentWeekStart.setDate(dataStore.currentWeekStart.getDate() + 7);
    renderReports();
}

function currentWeek() {
    dataStore.currentWeekStart = dataStore.getStartOfWeek(new Date());
    renderReports();
}

function calculateWeeklySummary() {
    const weekStart = dataStore.currentWeekStart;
    const weekEnd = dataStore.getEndOfWeek(weekStart);

    const weekEntries = dataStore.dailyEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const weekMaintenance = dataStore.maintenance.filter(m => {
        const maintenanceDate = new Date(m.date);
        return maintenanceDate >= weekStart && maintenanceDate <= weekEnd;
    });

    const totalCashBrought = weekEntries.reduce((sum, e) => sum + (e.cashBrought || 0), 0);
    const totalEarnings = weekEntries.reduce((sum, e) => sum + e.amountMade, 0);
    const totalFuel = weekEntries.reduce((sum, e) => sum + e.fuelCost, 0);
    const totalMaintenance = weekMaintenance.reduce((sum, m) => sum + m.cost, 0);
    const netProfit = totalEarnings - totalFuel - totalMaintenance;

    const summaryDiv = document.getElementById('weekly-summary');
    summaryDiv.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Total Cash Brought In:</span>
            <span class="summary-value" style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalCashBrought)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Earnings:</span>
            <span class="summary-value" style="color: var(--success-color)">${formatCurrency(totalEarnings)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Fuel:</span>
            <span class="summary-value">${formatCurrency(totalFuel)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Maintenance:</span>
            <span class="summary-value">${formatCurrency(totalMaintenance)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Net Profit:</span>
            <span class="summary-value" style="color: ${netProfit >= 0 ? 'var(--success-color)' : 'var(--error-color)'}">${formatCurrency(netProfit)}</span>
        </div>
    `;
}

function renderDriverBreakdown() {
    const weekStart = dataStore.currentWeekStart;
    const weekEnd = dataStore.getEndOfWeek(weekStart);

    const activeDrivers = dataStore.drivers.filter(d => d.isActive);
    const breakdownDiv = document.getElementById('driver-breakdown');

    if (activeDrivers.length === 0) {
        breakdownDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>No drivers to display.</p>
            </div>
        `;
        return;
    }

    breakdownDiv.innerHTML = activeDrivers.map(driver => {
        const driverEntries = dataStore.dailyEntries.filter(e => {
            const entryDate = new Date(e.date);
            return e.driverId === driver.id && entryDate >= weekStart && entryDate <= weekEnd;
        });

        const daysWorked = new Set(driverEntries.map(e => e.date)).size;
        const totalCashBrought = driverEntries.reduce((sum, e) => sum + (e.cashBrought || 0), 0);
        const totalEarnings = driverEntries.reduce((sum, e) => sum + e.amountMade, 0);
        const totalFuel = driverEntries.reduce((sum, e) => sum + e.fuelCost, 0);
        const netProfit = totalEarnings - totalFuel;
        const avgPerDay = daysWorked > 0 ? totalEarnings / daysWorked : 0;

        return `
            <div class="driver-performance">
                <div class="driver-header" onclick="toggleDriverDetails(this)">
                    <div class="driver-header-info">
                        <h4>${driver.name} - ${driver.taxiNumber}</h4>
                        <p>Cash Brought: ${formatCurrency(totalCashBrought)} | Days: ${daysWorked} | Net: ${formatCurrency(netProfit)}</p>
                    </div>
                    <span class="expand-icon">▼</span>
                </div>
                <div class="driver-details-content">
                    <div class="detail-row">
                        <span>Total Cash Brought In:</span>
                        <span style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalCashBrought)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Total Earnings:</span>
                        <span style="color: var(--success-color)">${formatCurrency(totalEarnings)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Total Fuel:</span>
                        <span>${formatCurrency(totalFuel)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Net Profit:</span>
                        <span style="color: ${netProfit >= 0 ? 'var(--success-color)' : 'var(--error-color)'}">${formatCurrency(netProfit)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Days Worked:</span>
                        <span>${daysWorked}</span>
                    </div>
                    <div class="detail-row">
                        <span>Average per Day:</span>
                        <span>${formatCurrency(avgPerDay)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleDriverDetails(header) {
    const performance = header.parentElement;
    performance.classList.toggle('expanded');
}

// ========================================
// Export Functions
// ========================================
function exportToPDF() {
    showNotification('PDF export feature coming soon!', 'error');
}

function exportToCSV() {
    const weekStart = dataStore.currentWeekStart;
    const weekEnd = dataStore.getEndOfWeek(weekStart);

    const weekEntries = dataStore.dailyEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    });

    if (weekEntries.length === 0) {
        showNotification('No data to export for this week', 'error');
        return;
    }

    const csvContent = [
        ['Driver Name', 'Taxi Number', 'Date', 'Cash Brought In', 'Amount Made', 'Fuel Cost', 'Fuel Type', 'Net Profit', 'Notes'],
        ...weekEntries.map(e => [
            e.driverName,
            e.taxiNumber,
            formatDate(e.date),
            e.cashBrought || 0,
            e.amountMade,
            e.fuelCost,
            e.fuelType,
            e.amountMade - e.fuelCost,
            e.notes || ''
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taxi-tracker-report-${formatDateInput(weekStart)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('CSV exported successfully!');
}

// ========================================
// Initialization
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    // Show splash screen for 2 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';

        // Initialize default date inputs
        document.getElementById('entry-date').valueAsDate = new Date();

        // Load initial data
        refreshDashboard();
        renderDriversList();
        populateDriverDropdowns();
        populateMaintenanceTaxiDropdown();
    }, 2000);
});
