import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
-------------------------------------------------------------------------------------------------------------------------------------------
  <!--Placeholder for deadline calendar view-->
<section id = 'deadlineDateCalendarContainer' class = 'deadlineDateCalendarContainer'>
  <div id = 'deadlineDateCalendarContentsContainer' class = 'deadlineDateCalendarContentsContainer'>
    <div id = 'monthYearReflectorContainer' class = 'monthYearReflectorContainer'>
      <div id = 'previousMonthWrapper' class = 'nextPreviousMonthWrapper' (click) = 'generatePreviousMonthCalendar()'>
        <img src = 'assets/images/task-manager/previous-l-secondary.svg'>
      </div>

      <div id = 'focussedMonthAndYear' class = 'focussedMonthAndYear'>
        {{basisForCalendarGeneration.format('MMMM').toUpperCase()}} {{basisForCalendarGeneration.format('YYYY')}}
      </div>

      <div id = 'nextMonthWrapper' class = 'nextPreviousMonthWrapper' (click) = 'generateNextMonthCalendar()'>
        <img src = 'assets/images/task-manager/next-l-secondary.svg'>
      </div>
    </div>

    <div id = 'weekDayNameWrapper' class = 'weekDayNameWrapper'>
      <div id = '{{"weekDayName" + i}}' class = 'weekDayName' *ngFor = 'let weekDay of weekDays; let i = index'>
        <div *ngIf = 'i !== weekDays.length - 1'>
            {{weekDay}}
        </div>
        <div *ngIf = 'i == weekDays.length - 1' class = 'isLastDayOfWeek'>
            {{weekDay}}
        </div>
      </div>
    </div>

    <div id = 'calendarDaysContainer' class = 'calendarDaysContainer'>
      <div id = '{{"calendarWeekRowContainer" + i}}' class = 'calendarWeekRowContainer' *ngFor = 'let week of calendarDays; let i = index'>
        <div id = '{{"calendarWeekDayContainer" + x}}' class = 'calendarWeekDayContainer' *ngFor = 'let day of week; let x = index' (click) = 'updateUserSelection(day)'>
          <div *ngIf = '!day.isRenderedMonthDate && x !== week.length - 1' class = 'notInMonthStyle'>
              {{day.date.date()}}
          </div>
          <div *ngIf = '!day.isRenderedMonthDate && x === week.length - 1' class = 'notInMonthStyle isLastDayOfWeek'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && !day.isSelected && x !== week.length - 1 && !day.isTodaysDate' class = 'inMonthStyle'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && !day.isSelected && x === week.length - 1 && !day.isTodaysDate' class = 'inMonthStyle isLastDayOfWeek'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && day.isSelected && x !== week.length - 1 && !day.isTodaysDate' class = 'inMonthStyle selectedDate'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && day.isSelected && x !== week.length - 1 && day.isTodaysDate' class = 'inMonthStyle selectedDate'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && !day.isSelected && x !== week.length - 1 && day.isTodaysDate' class = 'inMonthStyle todaysDate'>
              {{day.date.date()}}
          </div>
          <div *ngIf = 'day.isRenderedMonthDate && day.isSelected && x === week.length - 1 && !day.isTodaysDate' class = 'inMonthStyle isLastDayOfWeek selectedDate'>
              {{day.date.date()}}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
-----------------------------------------------------------------------------------------------------------------------------------------
            
 import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { TaskDataCaptureService } from '../../services/task-data-capture/task-data-capture.service';

@Component({
  selector: 'app-deadline-date-calendar',
  templateUrl: './deadline-date-calendar.component.html',
  styleUrls: ['./deadline-date-calendar.component.scss']
})
export class DeadlineDateCalendarComponent implements OnInit {

  constructor(private taskData : TaskDataCaptureService) { }
  /**
   * Captures the week day indicators
   */
  public weekDays = ['M','T','W','T','F','S','S'];
  /**
   * Captures the days of the calendar being rendered
   */
  public calendarDays = [];
  /**
   * Captures the date of which calendar has to be rendered
   */
  @Input() renderedMonthDate;
  /**
   * Captures the date on the basis of which calendar has be generated
   */
  public basisForCalendarGeneration = moment();
  /**
   * Capture the user selected date
   */
  public deadlineDate;
  /**
   * Event emitter to emit user selected date
   */
  @Output() emitUserSelectedDate : EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges() {
    if(this.renderedMonthDate) {
      this.basisForCalendarGeneration = moment(this.renderedMonthDate);
    }
  }
  /**
   * Handler to be called to generate the 42 days of grid
   */
  public generateCalendar() {
    const daysOfGrid = new Array(42);
    const firstDayOfMonth = moment(this.basisForCalendarGeneration).startOf('month').day();
    const startIndex = 1;
    let startOfCalendar;
    const calendarDays = [];
    if(startIndex < firstDayOfMonth) {
      startOfCalendar = moment(this.basisForCalendarGeneration).startOf('month').subtract(firstDayOfMonth - startIndex, 'days');
    }
    else {
      startOfCalendar = moment(this.basisForCalendarGeneration).startOf('month').subtract(firstDayOfMonth - (startIndex - 7), 'days');
    }
    for(let index = 0; index < daysOfGrid.length; index++) {
      const dateObj = {};
      dateObj['date'] = moment(startOfCalendar).date(moment(startOfCalendar).date() + index);
      dateObj['isTodaysDate'] = moment().isSame(moment(dateObj['date']), 'day');
      dateObj['isRenderedMonthDate'] = moment(this.basisForCalendarGeneration).isSame(moment(dateObj['date']), 'month');
      if(!this.renderedMonthDate) {
        dateObj['isSelected'] = moment().isSame(moment(dateObj['date']), 'day');
        if(dateObj['isSelected']) {
          this.deadlineDate = dateObj;
        }
      }
      else {
        dateObj['isSelected'] = moment(this.renderedMonthDate).isSame(moment(dateObj['date']), 'day');
        if(dateObj['isSelected']) {
          this.deadlineDate = dateObj;
        }
      }
      calendarDays.push(dateObj);
    }
    this.generateCalendarGrid(calendarDays);
  }
  /**
   * Handler to be called to convert days in array of arrays
   * @param calendarDays 
   */
  public generateCalendarGrid(calendarDays : Array<any>) {
    this.calendarDays = [];
    while(calendarDays.length) {
      this.calendarDays.push(calendarDays.splice(0,7));
    }
  }
  /**
   * Handler to be called on click of previous icon in calendar head section
   */
  public generatePreviousMonthCalendar() {
    if(moment(this.basisForCalendarGeneration).subtract(1, 'month').isSameOrAfter(moment(), 'month')){
      this.basisForCalendarGeneration = moment(this.basisForCalendarGeneration).subtract(1, 'month');
      this.generateCalendar();
    }
  }
  /**
   * Handler to be called on click of next icon in calendar head section
   */
  public generateNextMonthCalendar() {
    this.basisForCalendarGeneration = moment(this.basisForCalendarGeneration).add(1, 'month');
    this.generateCalendar();
  }
  /**
   * Handler to be called on click of date in view
   * @param dateObj 
   */
  public updateUserSelection(dateObj) {
    if(moment(dateObj['date']).isSameOrAfter(moment(), 'day') && moment(dateObj['date']).isSame(moment(this.basisForCalendarGeneration), 'month')) {
      this.deadlineDate.isSelected = false;
      this.deadlineDate = dateObj;
      this.deadlineDate.isSelected = true;
      this.emitUserSelectedDate.emit(moment(dateObj['date']));
    }
  }
}

------------------------------------------------------------------------------------------------------------------------------------------

.deadlineDateCalendarContainer{
    display: flex;
    flex-direction: row;
    justify-content: center;

    .deadlineDateCalendarContentsContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 308px;

        .monthYearReflectorContainer{
            width: 308px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-top: 1px solid #f0f0f0;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 19px;

            .nextPreviousMonthWrapper{
                margin-top: 12px;
                margin-bottom: 12px;
                cursor: pointer;
            }

            .focussedMonthAndYear{
                margin-top: 14px;
                margin-bottom: 15px;
                height: 19px;
                font-size: 14px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: normal;
                letter-spacing: normal;
                text-align: center;
                color: #2d2d2d;
            }
        }

        .weekDayNameWrapper{
            display: flex;
            flex-direction: row;

            .weekDayName{
                width: calc(308px / 7);
                height: calc(252px / 7);
                font-size: 14px;
                font-weight: 600;
                font-style: normal;
                font-stretch: normal;
                line-height: 2.86;
                letter-spacing: normal;
                text-align: center;
                color: #8a8a8a;
            }
        }

        .calendarDaysContainer{
            display: flex;
            flex-direction: column;

            .calendarWeekRowContainer{
                display: flex;
                flex-direction: row;

                .calendarWeekDayContainer{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: calc(308px / 7);
                    height: calc(252px / 7);
                    cursor: pointer;

                    .notInMonthStyle{
                        width: calc(308px / 7);
                        height: calc(252px / 7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 600;
                        font-style: normal;
                        font-stretch: normal;
                        line-height: 2.86;
                        letter-spacing: normal;
                        color: #8a8a8a;
                    }

                    .inMonthStyle{
                        width: calc(308px / 7);
                        height: calc(252px / 7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 600;
                        font-style: normal;
                        font-stretch: normal;
                        line-height: 2.86;
                        letter-spacing: normal;
                        text-align: center;
                        color: #2d2d2d;
                    }

                    .selectedDate {
                        color: white;
                        height: 28px;
                        border-radius: 14.5px;
                        background-image: linear-gradient(317deg, #5169d6, #394094);
                    }

                    .todaysDate {
                        height: 28px;
                        border-radius: 14.5px;
                        border: solid 1px #2d2d2d;
                        background-color: #ffffff;
                    }
                }
            }
        }
    }

    .isLastDayOfWeek{
        background-color: #fafafa;
    }
}
