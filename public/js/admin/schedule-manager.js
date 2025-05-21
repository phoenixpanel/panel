/**
 * PhoenixPanel Schedule Manager
 * 
 * This file handles the scheduling functionality for ad campaigns,
 * including calendar view, date/time pickers, and recurring schedules.
 */

class ScheduleManager {
    /**
     * Constructor
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.options = Object.assign({
            calendarSelector: '#campaign-calendar',
            scheduleFormSelector: '#schedule-form',
            startDateSelector: '#start_date',
            startTimeSelector: '#start_time',
            endDateSelector: '#end_date',
            endTimeSelector: '#end_time',
            recurringSelector: '#recurring_schedule',
            timeOfDaySelector: '#time_of_day',
            submitButtonSelector: '#save-schedule',
            placementIdSelector: '#schedule_placement_id'
        }, options);
        
        this.calendar = null;
        this.events = [];
        this.currentPlacementId = null;
    }
    
    /**
     * Initialize the Schedule Manager
     */
    init() {
        this.initCalendar();
        this.initDateTimePickers();
        this.initRecurringOptions();
        this.initTimeOfDayOptions();
        this.setupEventListeners();
        this.loadExistingSchedules();
    }
    
    /**
     * Initialize the calendar view
     */
    initCalendar() {
        const calendarEl = document.querySelector(this.options.calendarSelector);
        if (!calendarEl) return;
        
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: this.events,
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            select: this.handleDateSelect.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventDrop: this.handleEventDrop.bind(this),
            eventResize: this.handleEventResize.bind(this)
        });
        
        this.calendar.render();
    }
    
    /**
     * Initialize date and time pickers
     */
    initDateTimePickers() {
        // Initialize date pickers
        flatpickr(this.options.startDateSelector, {
            enableTime: false,
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                // Update minimum date for end date picker
                const endDatePicker = document.querySelector(this.options.endDateSelector)._flatpickr;
                endDatePicker.set('minDate', dateStr);
            }
        });
        
        flatpickr(this.options.endDateSelector, {
            enableTime: false,
            dateFormat: "Y-m-d"
        });
        
        // Initialize time pickers
        flatpickr(this.options.startTimeSelector, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true
        });
        
        flatpickr(this.options.endTimeSelector, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true
        });
    }
    
    /**
     * Initialize recurring schedule options
     */
    initRecurringOptions() {
        const recurringSelect = document.querySelector(this.options.recurringSelector);
        if (!recurringSelect) return;
        
        // Initialize select2 for multiple selection
        $(this.options.recurringSelector).select2({
            placeholder: "Select days of the week",
            allowClear: true,
            multiple: true
        });
    }
    
    /**
     * Initialize time of day targeting options
     */
    initTimeOfDayOptions() {
        const timeOfDaySelect = document.querySelector(this.options.timeOfDaySelector);
        if (!timeOfDaySelect) return;
        
        // Initialize select2 for multiple selection
        $(this.options.timeOfDaySelector).select2({
            placeholder: "Select hours of the day",
            allowClear: true,
            multiple: true
        });
        
        // Populate hours
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            const option = new Option(`${hour}:00 - ${hour}:59`, i.toString(), false, false);
            timeOfDaySelect.appendChild(option);
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Form submission
        const form = document.querySelector(this.options.scheduleFormSelector);
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Open schedule modal button
        document.querySelectorAll('.open-schedule-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const placementId = e.currentTarget.getAttribute('data-placement-id');
                const placementName = e.currentTarget.getAttribute('data-placement-name');
                
                this.openScheduleModal(placementId, placementName);
            });
        });
    }
    
    /**
     * Load existing schedules from the server
     */
    loadExistingSchedules() {
        // Get all placement IDs
        const placementIds = [];
        document.querySelectorAll('.open-schedule-modal').forEach(button => {
            placementIds.push(button.getAttribute('data-placement-id'));
        });
        
        if (placementIds.length === 0) return;
        
        // Fetch schedules for all placements
        fetch('/admin/settings/ads/schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ placement_ids: placementIds })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.events = data.schedules.map(schedule => this.convertToCalendarEvent(schedule));
                if (this.calendar) {
                    this.calendar.removeAllEvents();
                    this.calendar.addEventSource(this.events);
                }
            }
        })
        .catch(error => {
            console.error('Error loading schedules:', error);
        });
    }
    
    /**
     * Convert a schedule object to a calendar event
     * @param {Object} schedule - The schedule data
     * @return {Object} - Calendar event object
     */
    convertToCalendarEvent(schedule) {
        const event = {
            id: `placement-${schedule.id}`,
            title: schedule.name,
            start: schedule.start_date,
            end: schedule.end_date,
            allDay: true,
            extendedProps: {
                placementId: schedule.id,
                recurring: schedule.recurring_schedule,
                timeOfDay: schedule.time_of_day_targeting
            }
        };
        
        // Set color based on active status
        if (schedule.is_active) {
            event.backgroundColor = '#28a745';
            event.borderColor = '#28a745';
        } else {
            event.backgroundColor = '#6c757d';
            event.borderColor = '#6c757d';
        }
        
        // Handle recurring events
        if (schedule.recurring_schedule && schedule.recurring_schedule.length > 0) {
            event.daysOfWeek = this.convertDaysOfWeekToNumbers(schedule.recurring_schedule);
            event.startRecur = schedule.start_date;
            event.endRecur = schedule.end_date;
        }
        
        return event;
    }
    
    /**
     * Convert day names to day numbers for FullCalendar
     * @param {Array} daysOfWeek - Array of day names
     * @return {Array} - Array of day numbers (0=Sunday, 1=Monday, etc.)
     */
    convertDaysOfWeekToNumbers(daysOfWeek) {
        const dayMap = {
            'sunday': 0,
            'monday': 1,
            'tuesday': 2,
            'wednesday': 3,
            'thursday': 4,
            'friday': 5,
            'saturday': 6
        };
        
        return daysOfWeek.map(day => dayMap[day.toLowerCase()]);
    }
    
    /**
     * Handle date selection in the calendar
     * @param {Object} info - Selection information
     */
    handleDateSelect(info) {
        // Open the schedule modal with pre-filled dates
        $('#scheduleModal').modal('show');
        
        // Set the date values
        document.querySelector(this.options.startDateSelector)._flatpickr.setDate(info.startStr);
        document.querySelector(this.options.endDateSelector)._flatpickr.setDate(info.endStr);
    }
    
    /**
     * Handle clicking on an event in the calendar
     * @param {Object} info - Event information
     */
    handleEventClick(info) {
        const placementId = info.event.extendedProps.placementId;
        const placementName = info.event.title;
        
        this.openScheduleModal(placementId, placementName);
    }
    
    /**
     * Handle dragging and dropping an event
     * @param {Object} info - Event information
     */
    handleEventDrop(info) {
        this.updateEventDates(info.event);
    }
    
    /**
     * Handle resizing an event
     * @param {Object} info - Event information
     */
    handleEventResize(info) {
        this.updateEventDates(info.event);
    }
    
    /**
     * Update event dates on the server
     * @param {Object} event - The calendar event
     */
    updateEventDates(event) {
        const placementId = event.extendedProps.placementId;
        
        fetch('/admin/settings/ads/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                placement_id: placementId,
                start_date: event.start ? event.start.toISOString().split('T')[0] : null,
                end_date: event.end ? event.end.toISOString().split('T')[0] : null
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Error updating schedule:', data.message);
                // Revert the change
                this.calendar.refetchEvents();
            }
        })
        .catch(error => {
            console.error('Error updating schedule:', error);
            // Revert the change
            this.calendar.refetchEvents();
        });
    }
    
    /**
     * Open the schedule modal for a specific placement
     * @param {string} placementId - The placement ID
     * @param {string} placementName - The placement name
     */
    openScheduleModal(placementId, placementName) {
        this.currentPlacementId = placementId;
        
        // Set the placement ID in the form
        document.querySelector(this.options.placementIdSelector).value = placementId;
        
        // Set the modal title
        document.querySelector('#scheduleModalLabel').textContent = `Schedule for ${placementName}`;
        
        // Fetch the current schedule for this placement
        fetch(`/admin/settings/ads/schedule/${placementId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.populateScheduleForm(data.placement);
            }
        })
        .catch(error => {
            console.error('Error fetching schedule:', error);
        });
        
        // Show the modal
        $('#scheduleModal').modal('show');
    }
    
    /**
     * Populate the schedule form with placement data
     * @param {Object} placement - The placement data
     */
    populateScheduleForm(placement) {
        // Set start date and time
        if (placement.start_date) {
            const startDate = new Date(placement.start_date);
            document.querySelector(this.options.startDateSelector)._flatpickr.setDate(
                startDate.toISOString().split('T')[0]
            );
            document.querySelector(this.options.startTimeSelector)._flatpickr.setDate(
                `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`
            );
        } else {
            document.querySelector(this.options.startDateSelector)._flatpickr.clear();
            document.querySelector(this.options.startTimeSelector)._flatpickr.clear();
        }
        
        // Set end date and time
        if (placement.end_date) {
            const endDate = new Date(placement.end_date);
            document.querySelector(this.options.endDateSelector)._flatpickr.setDate(
                endDate.toISOString().split('T')[0]
            );
            document.querySelector(this.options.endTimeSelector)._flatpickr.setDate(
                `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
            );
        } else {
            document.querySelector(this.options.endDateSelector)._flatpickr.clear();
            document.querySelector(this.options.endTimeSelector)._flatpickr.clear();
        }
        
        // Set recurring schedule
        $(this.options.recurringSelector).val(placement.recurring_schedule || []).trigger('change');
        
        // Set time of day targeting
        $(this.options.timeOfDaySelector).val(placement.time_of_day_targeting || []).trigger('change');
    }
    
    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const placementId = document.querySelector(this.options.placementIdSelector).value;
        
        // Get form data
        const startDate = document.querySelector(this.options.startDateSelector).value;
        const startTime = document.querySelector(this.options.startTimeSelector).value;
        const endDate = document.querySelector(this.options.endDateSelector).value;
        const endTime = document.querySelector(this.options.endTimeSelector).value;
        
        // Combine date and time
        let startDateTime = null;
        if (startDate) {
            startDateTime = startTime ? `${startDate} ${startTime}` : `${startDate} 00:00`;
        }
        
        let endDateTime = null;
        if (endDate) {
            endDateTime = endTime ? `${endDate} ${endTime}` : `${endDate} 23:59`;
        }
        
        // Get recurring schedule and time of day targeting
        const recurringSchedule = $(this.options.recurringSelector).val();
        const timeOfDayTargeting = $(this.options.timeOfDaySelector).val();
        
        // Submit the data
        fetch('/admin/settings/ads/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                placement_id: placementId,
                start_date: startDateTime,
                end_date: endDateTime,
                recurring_schedule: recurringSchedule,
                time_of_day_targeting: timeOfDayTargeting
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Close the modal
                $('#scheduleModal').modal('hide');
                
                // Show success message
                toastr.success('Schedule updated successfully');
                
                // Refresh the calendar
                this.loadExistingSchedules();
                
                // Update the status indicator in the table
                const statusCell = document.querySelector(`tr[data-placement-id="${placementId}"] .status-cell`);
                if (statusCell) {
                    if (data.is_currently_active) {
                        statusCell.innerHTML = '<span class="label label-success">Active</span>';
                    } else {
                        statusCell.innerHTML = '<span class="label label-default">Scheduled</span>';
                    }
                }
            } else {
                toastr.error(data.message || 'Error updating schedule');
            }
        })
        .catch(error => {
            console.error('Error updating schedule:', error);
            toastr.error('Error updating schedule');
        });
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the ads settings page
    if (document.getElementById('campaign-calendar')) {
        const scheduleManager = new ScheduleManager();
        scheduleManager.init();
        
        // Make it globally accessible
        window.scheduleManager = scheduleManager;
    }
});