import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  private employMentType : string = 'FTE';
  private option1Value : boolean = true;
  private selectedCity : string = 'default' ;
  private hasError : boolean = false;

  private hasCityError(model) : void {
    if(model.value === "default")
    {
      this.hasError = true;
    }
    else
    {
      this.hasError = false;
    }
  }
}



-------------------------------------------------------------------------------------------------------------------------------------------
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ScheduleCaptureService } from '../../services/schedule-capture/schedule-capture.service';
import { SchedulerConstants } from '../../constants/scheduler-constants';
import * as moment from 'moment';
import { RecurrenceDetailsComponent } from '../recurrence-details/recurrence-details.component';

@Component({
  selector: 'app-meeting-recurrence',
  templateUrl: './meeting-recurrence.component.html',
  styleUrls: ['./meeting-recurrence.component.scss']
})
export class MeetingRecurrenceComponent implements OnInit, AfterViewInit {

  constructor(private dataCaptureService : ScheduleCaptureService) { }
  /**
   * Captures date of the meeting
   */
  public meetingDate;
  /**
   * Captures start time of meeting
   */
  public meetingStartTime;
  /**
   * Captures end time of meeting
   */
  public meetingEndTime;
  /**
   * Captures the options based on which to repeat a meeting
   */
  public options = SchedulerConstants.MEETING_RECURRENCE_OPTIONS;
  /**
   * Captures the user selected option
   */
  public optionSelected = this.options[0];
  /**
   * Captures value of the meeting instances every week
   */
  public weekCounter = 1;
  /**
   * Captures the counter for month
   */
  public monthlyCounter = 1;
  /**
   * Captures the counter for daily
   */
  public dailyCounter = 1;
  /**
   * Captures the days of week
   */
  public weekDays = [
    {day : 'Sunday', displayValue : 'S', isSelected : false, dayIndex : 0},
    {day : 'Monday', displayValue : 'M', isSelected : false, dayIndex : 1},
    {day : 'Tuesday', displayValue : 'T', isSelected : false, dayIndex : 2},
    {day : 'Wednesday', displayValue : 'W', isSelected : false, dayIndex : 3},
    {day : 'Thursday', displayValue : 'T', isSelected : false, dayIndex : 4},
    {day : 'Friday', displayValue : 'F', isSelected : false, dayIndex : 5},
    {day : 'Saturday', displayValue : 'S', isSelected : false, dayIndex : 6}
  ];
  /**
   * Captures days of weeks to be rendered in the month option
   */
  public monthWeekDays = SchedulerConstants.MEETING_RECURRENCE_DAYS_OF_WEEK;
  /**
   * Captures month Week Day Selected
   */
  public monthWeekDaySelected = this.monthWeekDays[1];
  /**
   * Captures the week of month
   */
  public weeksOfMonth = SchedulerConstants.MEETING_RECURRENCE_WEEKS_OF_MONTH;
  /**
   * Captures the day of month selected by user
   */
  public weekOfMonthOptionSelected = this.weeksOfMonth[0];
  /**
   * Captures options when meeting ends
   */
  public meetingEndOptions = SchedulerConstants.MEETING_RECURRENCE_MEETING_END_OPTIONS;
  /**
   * Captures user selected end option
   */
  public meetingEnd = this.meetingEndOptions[0];
  /**
   * Captures the end date of the meeting
   */
  public meetingEndsOnDate = moment();
  /**
   * Captures visibility of the calendar
   */
  public openCalendar : boolean = false;
  /**
   * Captures number of occurences after which meeting ends
   */
  public afterNumberOfOccurences : number = 1;
  /**
   * Captures the days of month
   */
  public daysOfMonth = [];
  /**
   * Captures user selected day of the month
   */
  public dayOfTheMonth;
   /**
   * Event emitter to notify of recurrence cancel click
   */
  public oncancelRecurrence : EventEmitter<any> = new EventEmitter<any>();
  /**
   * Event emitter to notify of recurrence done click
   */
  public onRecurrenceSet : EventEmitter<any> = new EventEmitter<any>();
  /**
   * Captures the constants to be bound in view
   */
  public constants = SchedulerConstants;
  /**
   * Captures the end date of recurrence when on option is selected
   */
  public recurrenceEndDate =  moment();
  /**
   * Captures whether to set values or not
   */
  public isDatesSet : boolean = false;

   /**
    * Captures the index of the current pop up screen
    */
   @Input() currentPopUpIndex: number;

   public recurenceCustomizeView : boolean = false;

   public onRemoveRecurrence : EventEmitter<any> = new EventEmitter<any>();

   @Output() closeRecurence : EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    if(this.currentPopUpIndex === 6){
      this.recurenceCustomizeView = true;
    }
    this.meetingDate = moment(this.dataCaptureService.dataObj.dateAndTime.date);
    this.meetingStartTime = this.dataCaptureService.dataObj.dateAndTime.displayStartTime;
    this.meetingEndTime = this.dataCaptureService.dataObj.dateAndTime.displayEndTime;
    this.dayOfTheMonth = this.meetingDate.date();
    this.daysOfMonthGenerator();
    if(!Object.keys(this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials).length) {
      this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials['meetingStartTime'] = this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'];
      this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials['meetingEndTime'] = this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'];
    }
  }
  ngAfterViewInit(){}
  /**
   * Handler to be called when user clicks on calendar icon
   */
  public openSchedulerCalendar() {
    this.openCalendar = true;
  }
  /**
   * Handler to be called when outside click is selected or cancel event is fired
   */
  public closeSchedulerCalendar() {
    this.openCalendar = false;
  }
  /**
   * Handler to be called on click of decrement for After options
   */
  public decrementAfterCounter() {
    if(this.afterNumberOfOccurences > 1) {
      this.afterNumberOfOccurences = this.afterNumberOfOccurences - 1;
    }
  }
  /**
   * Handler to be called on click of increment for After options
   */
  public incrementAfterCounter() {
    this.afterNumberOfOccurences = this.afterNumberOfOccurences + 1;
  }
  /**
   * Handler to be called on click of decrement for Every options for the weekly option selected
   */
  public decrementEveryWeekCounter() {
    if(this.weekCounter > 1) {
      this.weekCounter = this.weekCounter - 1;
    }
  }
  /**
   * Handler to be called on click of increment for Every options for the weekly option selected
   */
  public incrementEveryWeekCounter() {
    if(this.weekCounter < 52) {
      this.weekCounter = this.weekCounter + 1;
    }
  }
  /**
   * Handler to be called on click of decrement for Every options for the daily option selected
   */
  public decrementEveryDayCounter() {
    if(this.dailyCounter > 1) {
      this.dailyCounter = this.dailyCounter - 1;
    }
  }
  /**
   * Handler to be called on click of increment for Every options for the daily option selected
   */
  public incrementEveryDayCounter() {
    if(this.dailyCounter < 366) {
      this.dailyCounter = this.dailyCounter + 1;
    }
  }
  /**
   * Handler to be called on click of decrement for Every options for the monthly option selected
   */
  public decrementEveryMonthCounter() {
    if(this.monthlyCounter > 1) {
      this.monthlyCounter = this.monthlyCounter - 1;
    }
  }
  /**
   * Handler to be called on click of increment for Every options for the monthly option selected
   */
  public incrementEveryMonthCounter() {
    if(this.monthlyCounter < 12) {
      this.monthlyCounter = this.monthlyCounter + 1;
    }
  }
  /**
   * Handler to be called when user clicks on day to select or vice versa
   * @param dayOfWeek 
   */
  public weekDaySelected(dayOfWeek) {
    dayOfWeek.isSelected = !dayOfWeek.isSelected;
  }
  /**
   * Handler to generate days of the month
   */
  public daysOfMonthGenerator() {
    this.daysOfMonth= [];
    for(let index = 1; index <= 31; index++) {
      this.daysOfMonth.push(index);
    }
  }
  /**
   * Handler to be called when user clicks on cancel link in the recurrence screen
   * TODO - Reset recurrence in new meeting component as well
   */
  public cancelRecurrence() : void {
    this.oncancelRecurrence.emit();
  }
  /**
   * Handler to be called when user clicks on done link in the recurrence screen
   */
  public recurrenceSet() : void {
    this.onRecurrenceSet.emit();
  }
   /**
   * Handler to be called when user clicks on remove link in add more details screen 
   */
  public removeRecurrenceAddMoreDetails() : void {
    this.dataCaptureService.dataObj.meetingRecurrence.removeRecurrence = true;
    this.dataCaptureService.dataObj.meetingRecurrence.isRecurrenceSet = false;
    if (Object.keys(this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials).length) {
      this.dataCaptureService.dataObj.dateAndTime['date'] = this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials['meetingStartTime'];
      this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'] = this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials['meetingStartTime'];
      this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'] = this.dataCaptureService.dataObj.meetingRecurrence.recurrenceInitials['meetingEndTime'];
    }
    this.closeRecurence.emit();
  }
  /**
   * Handler to capture 
   * @param eventData 
   */
  public userSelectedDateFromCalendar(eventData) {
    this.recurrenceEndDate = eventData;
    this.openCalendar = false;
  }
  /**
   * Handler to be called to set the values selected in view
   */
  public updateRecurrenceSelections() {
    const recurrenceDetails = {};
    recurrenceDetails['optionSelected'] = this.optionSelected;
    if(this.optionSelected === this.options[0]) {
      recurrenceDetails['counter'] = this.weekCounter;
      const daysOfWeek = [];
      this.weekDays.filter((element) => {if(element.isSelected) { return element; }}).forEach((element) => { daysOfWeek.push(element.day) });
      recurrenceDetails['days'] = daysOfWeek;
    }
    else if(this.optionSelected === this.options[1]) {
      recurrenceDetails['counter'] = this.dailyCounter;
    }
    else if(this.optionSelected === this.options[2]) {
      recurrenceDetails['counter'] = this.monthlyCounter;
      recurrenceDetails['weekDay'] = this.weekOfMonthOptionSelected;
      if(this.weekOfMonthOptionSelected === this.weeksOfMonth[0]) {
        recurrenceDetails['dayOfMonth'] = this.dayOfTheMonth;
      }
      else {
        recurrenceDetails['dayOfWeek'] = this.monthWeekDaySelected;
      }
    }
    this.dataCaptureService.dataObj.meetingRecurrence.recurrenceDetails = recurrenceDetails;
  }
  /**
   * Handler to be called to generate the recurrence pattern for options
   */
  public generateRecurrencePattern() {
    if(this.optionSelected && this.meetingEnd) {
      if(this.optionSelected === this.options[0] && this.weekCounter && this.checkIfWeekDayIsSelected().length > 0) {
        this.generateWeeklyPattern();
        this.updateRecurrenceSelections();
        this.recurrenceSet();
      }
      else if(this.optionSelected === this.options[1] && this.dailyCounter) {
        this.generateDailyPattern();
        this.updateRecurrenceSelections();
        this.recurrenceSet();
      }
      else if(this.optionSelected === this.options[2] && this.monthlyCounter && ((this.weekOfMonthOptionSelected && this.monthWeekDaySelected) 
      || (this.weekOfMonthOptionSelected && this.weekOfMonthOptionSelected === this.weeksOfMonth[0] && this.dayOfTheMonth))) {
        this.generateMonthlyPattern();
        this.updateRecurrenceSelections();
        this.recurrenceSet();
      }
    }
  }
  /**
   * Handler to determine the days of week selected for the recurrence
   */
  public checkIfWeekDayIsSelected() {
    const selectedWeekDays = [];
    for(let index = 0; index < this.weekDays.length; index++) {
      if(this.weekDays[index].isSelected) {
        selectedWeekDays.push(this.weekDays[index]);
      }
    }
    return selectedWeekDays;
  }
  /**
   * Handler to be called to set the range properties on the recurrencePattern object
   * @param recurrencePattern 
   */
  public generateRangePattern(recurrencePattern) {
    //Meeting end option is On which date of the calendar
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      recurrencePattern['range'] = {
        type : 'endDate',
        startDate : `${this.meetingDate.year()}-${this.meetingDate.month() + 1}-${this.meetingDate.date()}`,
        endDate : `${this.recurrenceEndDate.year()}-${this.recurrenceEndDate.month() + 1}-${this.recurrenceEndDate.date()}`
      }; 
    }
    //Meeting end option is After how many recurrences
    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      recurrencePattern['range'] = {
        type : 'numbered',
        numberOfOccurrences : this.afterNumberOfOccurences
      };
    }
    //Meeting end option is Never i.e. infine number of occurences of meeting
    else if(this.meetingEnd === this.meetingEndOptions[0]) {
      recurrencePattern['range'] = {
        type : 'noEnd'
      };
      recurrencePattern['recurrenceType'] = 'noEnd';
      //Setting the time zone if option is monthly
      if(this.optionSelected === this.options[2]) {
        const startTime = this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'].toString();
        recurrencePattern['timeZone'] = `${startTime.split('GMT')[1].split(' ')[0].slice(0,3)}:${startTime.split('GMT')[1].split(' ')[0].slice(3,5)}`;
      }
      this.dataCaptureService.dataObj.meetingRecurrence.isRecurrenceSet = true;
      this.dataCaptureService.dataObj.meetingRecurrence.recurrencePattern = recurrencePattern;
    }
  }
  /**
   * Handler to be called to generate Daily pattern
   */
  public generateDailyPattern() {
    const recurrencePattern = {};
    recurrencePattern['pattern'] = {
      type : this.optionSelected.toLowerCase(),
      interval : this.dailyCounter
    };
    this.generateRangePattern(recurrencePattern);
    if(this.meetingEnd !== this.meetingEndOptions[0]) {
      this.generateDailyPatternDates(recurrencePattern);
    }
  }
  /**
   * Handler to be called to generate dates for the daily pattern
   * @param recurrencePattern 
   */
  public generateDailyPatternDates(recurrencePattern) {
    const dates = [];
    let startDateTime;
    let endDateTime;
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      let index = 1;
      while(moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.dailyCounter, 'days').isSameOrBefore(moment(this.recurrenceEndDate), 'day')) {
        const startDateTimeArray = [];
        startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.dailyCounter, 'days');
        endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(index * this.dailyCounter, 'days');
        startDateTimeArray.push(startDateTime);
        startDateTimeArray.push(endDateTime);
        dates.push(startDateTimeArray);
        index = index + 1;
      }
      if(dates.length > 0) {
        recurrencePattern.range.endDate = `${dates[dates.length - 1][0].year()}-${dates[dates.length - 1][0].month() + 1}-${dates[dates.length - 1][0].date()}`;
      }
    }

    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      for(let index = 1; index < this.afterNumberOfOccurences; index++) {
        const startDateTimeArray = [];
        startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.dailyCounter, 'days');
        endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(index * this.dailyCounter, 'days');
        startDateTimeArray.push(startDateTime);
        startDateTimeArray.push(endDateTime);
        dates.push(startDateTimeArray);
      }
    }
    this.dataCaptureService.dataObj.meetingRecurrence.recurrencePattern = recurrencePattern;
    this.dataCaptureService.dataObj.meetingRecurrence.recurrenceDates['dates'] = dates; 
    this.dataCaptureService.dataObj.meetingRecurrence.isRecurrenceSet = true;
  }
  /**
   * Handler to be called to generate Weekly pattern
   */
  public generateWeeklyPattern() {
    const recurrencePattern = {};
    const daysOfWeek = [];
    this.weekDays.filter((element) => {if(element.isSelected) { return element; }}).forEach((element) => { daysOfWeek.push(element.day) });
    recurrencePattern['pattern'] = {
      type : this.optionSelected.toLowerCase(),
      interval : this.weekCounter,
      daysOfWeek : daysOfWeek
    };
    this.generateRangePattern(recurrencePattern);
    if(this.meetingEnd !== this.meetingEndOptions[0]) {
      this.generateWeeklyPatternDates(recurrencePattern);
    }
    else {
      this.setMeetingStartEndTime();
    }
  }
  /**
   * Handler to be called to generate dates array for On and After meeting end option when option selected is weekly
   * @param recurrencePattern 
   */
  public generateWeeklyPatternDates(recurrencePattern) {
    this.setMeetingStartEndTime();
    let dates = [];
    
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      dates = this.generateWeeklyDatesForOnOption(recurrencePattern);
    }
    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      dates = this.generateWeeklyDatesForAfterOption();
    }
    this.dataCaptureService.dataObj.meetingRecurrence.recurrencePattern = recurrencePattern;
    this.dataCaptureService.dataObj.meetingRecurrence.recurrenceDates['dates'] = dates; 
    this.dataCaptureService.dataObj.meetingRecurrence.isRecurrenceSet = true;
  }
  /**
   * Handler to be called to generate all the dates for each day of week selected till end date is encountered
   * @param recurrencePattern 
   */
  public generateWeeklyDatesForOnOption(recurrencePattern) {
    const dates = [];
    let startDateTime;
    let endDateTime;
    const filteredWeekDays = this.weekDays.filter((element) => {if(element.isSelected) { return element; }});

    for(let filteredDayIndex = 0; filteredDayIndex < filteredWeekDays.length; filteredDayIndex++) {
      let index = -1;
      const startDateTimeObject = this.setStartAndEndTimeForEachWeekDay(filteredWeekDays, filteredDayIndex);
      const initialStartDateTime = startDateTimeObject.startDateTime;
      const initialEndDateTime = startDateTimeObject.endDateTime;
      while(moment(initialStartDateTime).add((index + 1) * this.weekCounter, 'weeks').isSameOrBefore(this.recurrenceEndDate, 'day')) {
        index = index + 1;
        if(filteredWeekDays[filteredDayIndex].dayIndex === this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'].day() && index === 0) {
          continue;
        }
        const startDateTimeArray = [];
        startDateTime = moment(initialStartDateTime).add(index * this.weekCounter, 'weeks');
        endDateTime = moment(initialEndDateTime).add(index * this.weekCounter, 'weeks');
        startDateTimeArray.push(startDateTime);
        startDateTimeArray.push(endDateTime);
        dates.push(startDateTimeArray);
      }
    }
    this.updateRecurrenceStartEndDate(recurrencePattern, dates);
    return dates;
  }
  /**
   * Handler to be called to generate all the dates for each day of week selected till number of occurences selected
   */
  public generateWeeklyDatesForAfterOption() {
    const dates = [];
    let startDateTime;
    let endDateTime;
    const filteredWeekDays = this.weekDays.filter((element) => {if(element.isSelected) { return element; }});

    for(let filteredDayIndex = 0; filteredDayIndex < filteredWeekDays.length; filteredDayIndex++) {
      const startDateTimeObject = this.setStartAndEndTimeForEachWeekDay(filteredWeekDays, filteredDayIndex);
      const initialStartDateTime = startDateTimeObject.startDateTime;
      const initialEndDateTime = startDateTimeObject.endDateTime;
      for(let index = 0; index < this.afterNumberOfOccurences ; index++) {
        if(filteredWeekDays[filteredDayIndex].dayIndex === this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'].day() && index === 0) {
          continue;
        }
        const startDateTimeArray = [];
        startDateTime = moment(initialStartDateTime).add(index * this.weekCounter, 'weeks');
        endDateTime = moment(initialEndDateTime).add(index * this.weekCounter, 'weeks');
        startDateTimeArray.push(startDateTime);
        startDateTimeArray.push(endDateTime);
        dates.push(startDateTimeArray);
      }
    }
    return dates;
  }
  /**
   * Handler to check if the meeting date is same as selected day or not , if not than add the difference based on the position of day in week
   * @param filteredWeekDays 
   * @param filteredDayIndex 
   */
  public setStartAndEndTimeForEachWeekDay(filteredWeekDays, filteredDayIndex) {
    let startDateTime = null;
    let endDateTime = null;
    const daysDifference = filteredWeekDays[filteredDayIndex].dayIndex - moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).day();
    if(daysDifference > 0) {
      startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(daysDifference, 'days');
      endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(daysDifference, 'days');
    }
    else if(daysDifference === 0) {
      startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']);
      endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']);
    }
    else {
      startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(7 + daysDifference, 'days');
      endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(7 + daysDifference, 'days');
    }
    return {
      startDateTime : startDateTime,
      endDateTime : endDateTime
    };
  }
  /**
   * Handler to be called to check if the meeting date is one of the selected days or not
   * TODO - Need to create recurrence set component after which meeting start and end date won't get updated which is being updated as we go back to customization
   */
  public setMeetingStartEndTime() {
    const filteredWeekDays = this.weekDays.filter((element) => {if(element.isSelected) { return element; }});
    for(let index = 0; index < 7; index++) {
      for(let key = 0; key < filteredWeekDays.length; key++) {
        if(moment(this.meetingDate).add(index, 'days').day() === filteredWeekDays[key].dayIndex) {
          this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'] = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index, 'days');
          this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'] = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(index, 'days');
          return;
        }
      }
    }
  }
  /**
   * Handler to be called to generate Monthly pattern
   */
  public generateMonthlyPattern() {
    const recurrencePattern = {
      pattern : {
        type : this.optionSelected.toLowerCase(),
        interval : this.monthlyCounter
      }
    };
    //Option selected is day of the month
    if(this.weekOfMonthOptionSelected === this.weeksOfMonth[0]) {
      recurrencePattern.pattern['dayOfMonth'] = this.dayOfTheMonth;
    }
    //Option selected is first, second, third, fourth and last in view
    else {
      recurrencePattern.pattern['index'] = this.weekOfMonthOptionSelected.toLowerCase();
      recurrencePattern.pattern['daysOfWeek'] = [this.monthWeekDaySelected];
    }
    this.generateRangePattern(recurrencePattern);
    //Option selected is day of the month
    if(this.weekOfMonthOptionSelected === this.weeksOfMonth[0]) {
      this.generatorAndSetterForMonthDayOption(recurrencePattern);
    }
    //Option selected is first, second, third and fourth
    else if(this.weekOfMonthOptionSelected !== this.weeksOfMonth[0] && this.weekOfMonthOptionSelected !== this.weeksOfMonth[this.weeksOfMonth.length - 1]) {
      this.generatorAndSetterForMonthNumericalWeeks(recurrencePattern);
    }
    //Option selected is last from the view
    else if(this.weekOfMonthOptionSelected === this.weeksOfMonth[this.weeksOfMonth.length - 1]) {
      this.generatorAndSetterForMonthLastOption(recurrencePattern);
    }
  }
  /**
   * Handler to generate and set start end dates for the day option for monthly recurrence option
   * @param recurrencePattern 
   */
  public generatorAndSetterForMonthDayOption(recurrencePattern) {
    this.setStartEndTimeForTheMonthDay();
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      this.generatePatternDatesForMonthlyDayOnOption(recurrencePattern);
    }
    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      this.generatePatternDatesForMonthlyDayAfterOption(recurrencePattern);
    }
  }
  /**
   * Handler to generate and set start end dates for the first, second, third and fourth option for monthly recurrence option
   * @param recurrencePattern 
   */
  public generatorAndSetterForMonthNumericalWeeks(recurrencePattern) {
    this.setterForStartAndEndDate(this.dayIndex(), this.optionIndex(), 0, this.monthlyCounter, true);
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      this.generatePatternDatesForMonthlyWeekDaysOnOption(recurrencePattern, this.dayIndex(), this.optionIndex());
    }
    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      this.generatePatternDatesForMonthlyWeekDaysAfterOption(recurrencePattern, this.dayIndex(), this.optionIndex());
    }
  }
  /**
   * Handler to generate and set start end dates for the last option for monthly recurrence option
   * @param recurrencePattern 
   */
  public generatorAndSetterForMonthLastOption(recurrencePattern) {
    this.setterForStartAndEndDateMonthlyLastWeekOption(this.dayIndex(), 0, true);
    if(this.meetingEnd === this.meetingEndOptions[1]) {
      this.generatePatternDatesForMonthlyWeekLastOnOption(recurrencePattern);
    }
    else if(this.meetingEnd === this.meetingEndOptions[2]) {
      this.generatePatternDatesForMonthlyWeekLastAfterOption(recurrencePattern);
    }
  }
  /**
   * Handler to be called to generate pattern dates when week selected is last for monthly recurrence and meeting end On
   * @param recurrencePattern 
   */
  public generatePatternDatesForMonthlyWeekLastOnOption(recurrencePattern) {
    const dates = [];
    let index = 1;
    while(this.setterForStartAndEndDateMonthlyLastWeekOption(this.dayIndex(), index).meetingStartDateTime.isSameOrBefore(this.recurrenceEndDate, 'day')) {
      this.setStartAndEndDateMonthlyLastWeekOption(this.dayIndex(), index, dates);
      index = index + 1;
    }
    this.updateStateObject(recurrencePattern, dates);
    this.updateRecurrenceStartEndDate(recurrencePattern, dates);
  }
  /**
   * Handler to be called to generate pattern dates when week selected is last for monthly recurrence and meeting end After
   * @param recurrencePattern 
   */
  public generatePatternDatesForMonthlyWeekLastAfterOption(recurrencePattern) {
    const dates = [];
    for(let index = 1; index < this.afterNumberOfOccurences; index++) {
      this.setStartAndEndDateMonthlyLastWeekOption(this.dayIndex(), index, dates);
    }
    this.updateStateObject(recurrencePattern, dates);
  }
  /**
   * Handler to be called to set start and end time for each recurrence
   * @param dayIndex 
   * @param iterationIndex 
   * @param dates 
   */
  public setStartAndEndDateMonthlyLastWeekOption(dayIndex, iterationIndex, dates) {
    const startEndTime = this.setterForStartAndEndDateMonthlyLastWeekOption(dayIndex,iterationIndex);
    if(startEndTime) {
      let meetingStartDateTime = startEndTime.meetingStartDateTime;
      let meetingEndDateTime = startEndTime.meetingEndDateTime;
        const startDateTimeArray = [];
        startDateTimeArray.push(meetingStartDateTime);
        startDateTimeArray.push(meetingEndDateTime);
        dates.push(startDateTimeArray);
    }
  }
  /**
   * Handler to be called to generate the meeting start and end date for the last week day of the monthly recurrence pattern
   * @param dayIndex 
   * @param iterationIndex 
   * @param setDates 
   */
  public setterForStartAndEndDateMonthlyLastWeekOption(dayIndex, iterationIndex, setDates?: boolean) {
    let meetingStartDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).endOf('month');
    let meetingEndDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).endOf('month');
    const startHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).hours();
    const startMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).minutes();
    const endHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).hours();
    const endMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).minutes();
    meetingStartDateTime = moment(meetingStartDateTime).add(iterationIndex * this.monthlyCounter, 'months').endOf('month');
    meetingEndDateTime = moment(meetingEndDateTime).add(iterationIndex * this.monthlyCounter, 'months').endOf('month');
    for(let index = 0; index < 7; index++) {
      if(dayIndex === moment(meetingStartDateTime).subtract(index, 'days').day()) {
        meetingStartDateTime = moment(meetingStartDateTime).subtract(index, 'days');
        meetingEndDateTime = moment(meetingEndDateTime).subtract(index, 'days');
      }
    }
    meetingStartDateTime.set({hour : startHours, minute : startMinutes});
    meetingEndDateTime.set({hour : endHours, minute : endMinutes});
    if(setDates && meetingStartDateTime.isSameOrAfter(moment(), 'day')) {
      this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'] = moment(meetingStartDateTime);
      this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'] = moment(meetingEndDateTime);
      return;
    }
    else if(setDates) {
      iterationIndex = iterationIndex + 1;
      this.setterForStartAndEndDateMonthlyLastWeekOption(dayIndex, iterationIndex, true);
    }
    else{
      return {
        meetingStartDateTime : meetingStartDateTime,
        meetingEndDateTime : meetingEndDateTime
      };
    }
  }
  /**
   * Handler to be called when Week day first to last and week day name is selected along with On option
   * @param dayIndex 
   * @param optionIndex 
   */
  public generatePatternDatesForMonthlyWeekDaysOnOption(recurrencePattern, dayIndex, optionIndex) {
    const dates = [];
    let index = 1;
    while(this.setterForStartAndEndDate(dayIndex, optionIndex, index, this.monthlyCounter).meetingStartDateTime.isSameOrBefore(this.recurrenceEndDate, 'day')) {
      this.setStartAndEndDateTimeForWeeksNumericals(dayIndex, optionIndex, index, dates);
      index = index + 1;
    }
    this.updateStateObject(recurrencePattern, dates);
    this.updateRecurrenceStartEndDate(recurrencePattern, dates);
  }
  /**
   * Handler to be called when Week day first to last and week day name is selected along with After option
   * @param dayIndex 
   * @param optionIndex 
   */
  public generatePatternDatesForMonthlyWeekDaysAfterOption(recurrencePattern, dayIndex, optionIndex) {
    const dates = [];
    for(let index = 1; index < this.afterNumberOfOccurences; index++) {
      this.setStartAndEndDateTimeForWeeksNumericals(dayIndex, optionIndex, index, dates);
    }
    this.updateStateObject(recurrencePattern, dates);
  }
  /**
   * Handler to return the index of the day selected from dropdown
   */
  public dayIndex() {
    for(let index = 0; index < this.monthWeekDays.length; index++) {
      if(this.monthWeekDays[index] === this.monthWeekDaySelected) {
        return index;
      }
    }
  }
  /**
   * Handler to return the index of the week of the month selected from dropdown
   */
  public optionIndex() {
    for(let index = 0; index < this.weeksOfMonth.length; index++) {
      if(this.weeksOfMonth[index] === this.weekOfMonthOptionSelected) {
        return index;
      }
    }
  }
  /**
   * Handler to set the start and end date on the day of the week selected from view
   * @param dayIndex 
   * @param optionIndex 
   */
  public setStartAndEndDateTimeForWeeksNumericals(dayIndex, optionIndex, iterationIndex, dates) {
    const startEndTime = this.setterForStartAndEndDate(dayIndex, optionIndex, iterationIndex, this.monthlyCounter);
    if(startEndTime) {
      let meetingStartDateTime = startEndTime.meetingStartDateTime;
      let meetingEndDateTime = startEndTime.meetingEndDateTime;
        const startDateTimeArray = [];
        startDateTimeArray.push(meetingStartDateTime);
        startDateTimeArray.push(meetingEndDateTime);
        dates.push(startDateTimeArray);
    }
  }
  /**
   * Handler to be called to set start and end time for the month dates
   * @param dayIndex 
   * @param optionIndex 
   * @param iterationIndex 
   * @param monthlyCounter 
   * @param setDates 
   */
  public setterForStartAndEndDate(dayIndex, optionIndex, iterationIndex, monthlyCounter,setDates? : boolean) {
    let meetingStartDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']);
    let meetingEndDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']);
    const startHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).hours();
    const startMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).minutes();
    const endHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).hours();
    const endMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).minutes();
    meetingStartDateTime = moment(meetingStartDateTime).add(iterationIndex * monthlyCounter, 'months').startOf('month');
    meetingEndDateTime = moment(meetingEndDateTime).add(iterationIndex * monthlyCounter, 'months').startOf('month');
    for(let index = 0; index < 7; index++) {
      if(dayIndex === moment(meetingStartDateTime).date(meetingStartDateTime.date() + index).day()) {
        meetingStartDateTime = moment(meetingStartDateTime).date(meetingStartDateTime.date() + index + ((optionIndex - 1) * 7));
        meetingEndDateTime = moment(meetingEndDateTime).date(meetingEndDateTime.date() + index + ((optionIndex - 1) * 7));
      }
    }
    meetingStartDateTime.set({hour : startHours, minute : startMinutes});
    meetingEndDateTime.set({hour : endHours, minute : endMinutes});
    if(setDates && meetingStartDateTime.isSameOrAfter(moment(), 'day')) {
      this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'] = moment(meetingStartDateTime);
      this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'] = moment(meetingEndDateTime);
      return;
    }
    else if(setDates) {
      iterationIndex = iterationIndex + 1;
      this.setterForStartAndEndDate(dayIndex, optionIndex, iterationIndex, monthlyCounter, true);
    }
    else{
      return {
        meetingStartDateTime : meetingStartDateTime,
        meetingEndDateTime : meetingEndDateTime
      };
    }
  }
  /**
   * Handler to be called to set the start and end time when option selected is day
   */
  public setStartEndTimeForTheMonthDay() {
    let startTimeOfMeeting = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).date(this.dayOfTheMonth);
    const startHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).hours();
    const startMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).minutes();
    const endHours = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).hours();
    const endMinutes = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).minutes();
    if(startTimeOfMeeting.month() !== moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).month()) {
      startTimeOfMeeting = moment(startTimeOfMeeting).subtract(1 , 'month').endOf('month');
    }
    this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'] = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).date(startTimeOfMeeting.date());
    this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'] = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).date(startTimeOfMeeting.date());
    this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'].set({hour : startHours, minute: startMinutes});
    this.dataCaptureService.dataObj.dateAndTime['meetingEndTime'].set({hour : endHours, minute : endMinutes});
  }
  /**
   * Handler to be called to generate dates for monthly day and meeting end On option
   * @param recurrencePattern 
   */
  public generatePatternDatesForMonthlyDayOnOption(recurrencePattern) {
    const dates = [];
    let startDateTime;
    let endDateTime;
    let index = 1;
    while(moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.monthlyCounter, 'months').isSameOrBefore(this.recurrenceEndDate, 'day')) {
      const startDateTimeArray = [];
      startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.monthlyCounter, 'months');
      endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(index * this.monthlyCounter, 'months');
      if(moment(startDateTime).endOf('month').date() >= this.dayOfTheMonth) {
        startDateTime.date(this.dayOfTheMonth);
      }
      if(moment(endDateTime).endOf('month').date() >= this.dayOfTheMonth) {
        endDateTime.date(this.dayOfTheMonth);
      }
      startDateTimeArray.push(startDateTime);
      startDateTimeArray.push(endDateTime);
      dates.push(startDateTimeArray);
      index = index + 1;
    }
    this.updateStateObject(recurrencePattern, dates);
    this.updateRecurrenceStartEndDate(recurrencePattern, dates);
  }
  /**
   * Handler to be called to generate dates for monthly day and meeting end After option
   * @param recurrencePattern 
   */
  public generatePatternDatesForMonthlyDayAfterOption(recurrencePattern) {
    const dates = [];
    let startDateTime;
    let endDateTime;
    for(let index = 1; index < this.afterNumberOfOccurences; index++) {
      const startDateTimeArray = [];
      startDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingStartTime']).add(index * this.monthlyCounter, 'months');
      endDateTime = moment(this.dataCaptureService.dataObj.dateAndTime['meetingEndTime']).add(index * this.monthlyCounter, 'months');
      if(moment(startDateTime).endOf('month').date() >= this.dayOfTheMonth) {
        startDateTime.date(this.dayOfTheMonth);
      }
      if(moment(endDateTime).endOf('month').date() >= this.dayOfTheMonth) {
        endDateTime.date(this.dayOfTheMonth);
      }
      startDateTimeArray.push(startDateTime);
      startDateTimeArray.push(endDateTime);
      dates.push(startDateTimeArray);
    }
    this.updateStateObject(recurrencePattern, dates);
  }
  /**
   * Handler to be called set the state values for recurrence object
   * @param recurrencePattern 
   * @param dates 
   */
  public updateStateObject(recurrencePattern, dates) {
    this.dataCaptureService.dataObj.meetingRecurrence.recurrencePattern = recurrencePattern;
    this.dataCaptureService.dataObj.meetingRecurrence.recurrenceDates['dates'] = dates; 
    this.dataCaptureService.dataObj.meetingRecurrence.isRecurrenceSet = true;
  }
  /**
   * Handler to be called to set start and end date for the recurrence when On option is selected in view
   * @param recurrencePattern 
   * @param dates 
   */
  public updateRecurrenceStartEndDate(recurrencePattern, dates) {
    const startDate = this.dataCaptureService.dataObj.dateAndTime['meetingStartTime'];
    recurrencePattern.range.startDate = `${startDate.year()}-${startDate.month() + 1}-${startDate.date()}`;
    recurrencePattern.range.endDate = `${dates[dates.length - 1][0].year()}-${dates[dates.length - 1][0].month() + 1}-${dates[dates.length - 1][0].date()}`;
  }
  /**
   * Handler to be called when option is changed in the weekly, daily, monthly options dropdown
   * @param event 
   */
  public onSelectionChange(event) {
    if(event && event.value && event.value !== this.optionSelected) {
      this.resetCounters();
      this.optionSelected = event.value;
    }
  }
  /**
   * Reset month week daily counters
   */
  public resetCounters() {
    this.weekCounter = 1;
    this.monthlyCounter = 1;
    this.dailyCounter = 1;
  }
}
