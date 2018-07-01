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
