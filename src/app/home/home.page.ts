import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { ChartcrudService } from '../providers/chartcrud.service';
import { ChartdateService } from '../providers/chartdate.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {

  @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
  @ViewChild("booking", { static: true }) doughnutCanvas: ElementRef;
  @ViewChild("totalPax", { static: true }) totalPax: ElementRef;
  @ViewChild("courses", { static: true }) courses: ElementRef;
  @ViewChild("caddies", { static: true }) caddies: ElementRef;
  @ViewChild("members", { static: true }) members: ElementRef;
  @ViewChild("male", { static: true }) male: ElementRef;

  public barChart: Chart;
  public bookingchart: Chart;
  public Pax: Chart;
  public coursesCharts: Chart;
  public caddiesChart: Chart;
  public membersChart: Chart;
  public maleChart: Chart;

  type: any = "line";
  lessThanOrGreaterThan = "lessThan";
  filterLimit = 100;
  thisweek: any = [];
  chartData = {
    dataSet1: Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 590) + 10
    ),
  };
  levelsArr = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  months = [
    { month: "Jan", value: "0" },
    { month: "Feb", value: "1" },
    { month: "Mar", value: "2" },
    { month: "Apr", value: "3" },
    { month: "May", value: "4" },
    { month: "Jun", value: "5" },
    { month: "Jul", value: "6" },
    { month: "Aug", value: "7" },
    { month: "Sep", value: "8" },
    { month: "Oct", value: "9" },
    { month: "Nov", value: "10" },
    { month: "Dec", value: "11" },
  ];

  from = "0";

  toMonth = "12";
  doughnutChart: any;
  activeClass: any = 'today';

  typeBooking: any = 'pie';
  slotFutureBooking: any = 'slots';

  revenueSlotFutureBooking: any = 'future';
  typeRevenue: any = 'bar';

  typePax: any = 'pie';
  typeCaddies: any = 'doughnut';
  typeCourse: any = 'bar';
  typeMembers: any = 'bar';
  typeMale: any = 'pie';

  date = new Date();

  constructor(public chartCrud: ChartcrudService, public chartDate: ChartdateService) {
    this.chartDate.activeClass = 'today';
  }

  ngOnInit() {
    this.createtotalpaxChart();
    this.bookingChart();
    this.createChart();
    this.createCoursesChart();
    this.createCaddiesChart();
    this.createMembersChart();
    this.createMaleChart();
    this.maletodayData();
    this.membertodayData();
    this.caddiestodayData();
    this.coursetodayData();
  }
  createtotalpaxChart() {
    let yAxis = this.typePax == 'pie' || this.typePax == 'doughnut' ? false : true;
    this.Pax = new Chart(this.totalPax.nativeElement, {
      type: this.typePax,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Total Players (PAX)",
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 50,
              },
            },
          ],
        },
      },
      data: {
        labels: [
          "Total Pending",
          "Total Checked In",
          "Total In-Play",
          " Total Finished",
        ],
        datasets: [
          {
            fill: true,
            // type: this.type,
            label: "Pax",
            data: [300, 100, 40, 10],
            backgroundColor: [
              "rgba(153, 102, 255, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(75, 192, 192, 0.8)",
            ],
            spanGaps: false,
          },
        ],
      },
    });
  }

  createMaleChart() {
    let yAxis = this.typeMale == 'pie' || this.typeMale == 'doughnut' ? false : true;
    var chartText = this.maleChartText == 'slots'? 'Todays Male vs Female': this.maleChartText == 'week'? 'This Week Male vs Female': this.maleChartText == 'month'? 'This Month Male vs Female':' Future Male vs Female';
    var malechartData = this.maleChartText == 'slots'? [400,100]: this.maleChartText == 'week'?[340,100]: this.maleChartText == 'month'? [400,400]: [200,200];
    this.maleChart = new Chart(this.male.nativeElement, {
      type: this.typeMale,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 50,
              },
            },
          ],
        },
      },
      data: {
        labels: ["Male", "Female"],
        datasets: [
          {
            fill: true,
            // type: this.type,
            label: "male vs female",
            data: malechartData,
            backgroundColor: [
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(54, 162, 235, 0.8)",
            ],
            spanGaps: true,
          },
        ],
      },
    });
  }


  createMembersChart() {
    let yAxis = this.typeMembers == 'pie' || this.typeMembers == 'doughnut' ? false : true;
    var chartText = this.memberChartText == 'slots'? 'Todays Member': this.memberChartText == 'week'? 'This Week Members': this.memberChartText == 'month'? 'This Month Members':' Future Members';
    var memberchartData = this.memberChartText == 'slots'? [200,300]: this.memberChartText == 'week'?[100,100]: this.memberChartText == 'month'? [340,100]: [400,400];
    this.membersChart = new Chart(this.members.nativeElement, {
      type: this.typeMembers,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 50,
              },
            },
          ],
        },
      },
      data: {
        labels: ["Members", "Guests"],
        datasets: [
          {
            fill: true,
            // type: this.type,
            label: "member vs guest",
            data: memberchartData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(54, 162, 235, 0.8)",
            ],
            spanGaps: true,
          },
        ],
      },
    });
  }

  createCaddiesChart() {
    let yAxis = this.typeCaddies == 'pie' || this.typeCaddies == 'doughnut' ? false : true;
    var chartText = this.caddiesChartText == 'slots'? 'Todays Caddies': this.caddiesChartText == 'week'? 'This Week Caddies': this.caddiesChartText == 'month'? 'This Month Caddies':' Future Caddies';
    var caddieschartData = this.caddiesChartText == 'slots'? [30,170]: this.caddiesChartText == 'week'?[300,200]: this.caddiesChartText == 'month'? [600,100]: [300,600];
    this.caddiesChart = new Chart(this.caddies.nativeElement, {
      type: this.typeCaddies,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 50,
              },
            },
          ],
        },
      },
      data: {
        labels: ["Male", "Female"],
        datasets: [
          {
            fill: true,
            // type: this.type,
            label: "caddies & buggies",
            data: caddieschartData,
            backgroundColor: [
              "rgba(153, 102, 255, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(75, 192, 192, 0.8)",
            ],
            spanGaps: true,
          },
        ],
      },
    });
  }
  createCoursesChart() {
    let yAxis = this.typeCourse == 'pie' || this.typeCourse == 'doughnut' ? false : true;
    var chartText = this.courseChartText == 'slots'? 'Todays Courses': this.courseChartText == 'week'? 'This Week Courses': this.courseChartText == 'month'? 'This Month Courses':' Future Courses';
    var coursechartData = this.courseChartText == 'slots'? [170,30,200]: this.courseChartText == 'week'?[50,200,30]: this.courseChartText == 'month'? [200,300,100]: [300,100,50];
    this.coursesCharts = new Chart(this.courses.nativeElement, {
      type: this.typeCourse,
      options: {
        legend: {
          display: true,
      },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 50,
              },
            },
          ],
        },
      },
      data: {
        labels: ["East 1", "East 2", "West"],
        datasets: [
          {
            fill: true,
            // type: this.type,
            label: "course utilization",
            data: coursechartData,
            backgroundColor: [
              "rgb(126, 198, 34, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
            ],
            spanGaps: true,
          },
        ],
      },
    });
  }

  bookingChart() {
    let yAxis = this.typeBooking == 'pie' || this.typeBooking == 'doughnut' ? false : true;
   var chartText = this.slotFutureBooking == 'slots'? 'Todays Booking': this.slotFutureBooking == 'week'? 'This Week Bookings': this.slotFutureBooking == 'month'? 'This Month Bookings':' Future Bookings';
   var bookingchartData = this.slotFutureBooking == 'slots'? [100,50,50,20,30]: this.slotFutureBooking == 'week'?[200,100,100,60,40]: this.slotFutureBooking == 'month'? [300,150,150,60,90]: [400,200,200,120,80];
   var bookedslot = this.slotFutureBooking == 'slots' || this.slotFutureBooking == 'week' || this.slotFutureBooking == 'month'? 'Total Booked Slots': 'Total Future Bookings'
    this.bookingchart = new Chart(this.doughnutCanvas.nativeElement, {
      type: this.typeBooking,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 100,
              },
            },
          ],
        },
      },
      data: {
        labels: ["Total Slots","Slots Available", bookedslot ,"Morning", "Afternoon"],
        datasets: [
          {
            fill: true,
            type: this.typeBooking,
            label: "Bookings",
            data: bookingchartData,
            backgroundColor: [
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 99, 132, 0.8)",
            ],
            spanGaps: true,
          },
        ],
      },
    });
  }

  createChart() {
    let yAxis = this.typeRevenue == 'pie' || this.typeRevenue == 'doughnut' ? false : true;
    var chartText = this.revenueSlotFutureBooking == 'slots'? 'Todays Revenue': this.revenueSlotFutureBooking == 'week'? 'This Week Revenue': this.revenueSlotFutureBooking == 'month'? 'This Month Revenue':' Future Revenue';
    var revenuechartData1 = this.revenueSlotFutureBooking == 'slots'?[.5,2,2]: this.revenueSlotFutureBooking == 'week'? [1,3.4,4.6]: this.revenueSlotFutureBooking == 'month'?[2.7,5,3.5]:[1.5,2.5,3.5];
    var revenuechartData2 = this.revenueSlotFutureBooking == 'slots'? [1,3.4,4.6]: this.revenueSlotFutureBooking == 'week'?[.5,2,2]: this.revenueSlotFutureBooking == 'month'? [1.5,2.5,3.5]:[2.7,5,3.5];
    
    var bookedslot = this.revenueSlotFutureBooking == 'slots'? 'Total Revenue': 'Projected Revenues'
  //  var chartData = {
  //     dataSet1: Array.from(
  //       { length: 12},
  //       () => this.revenueSlotFutureBooking == 'slots'? Math.floor(Math.random() * 590) + 20 :  this.revenueSlotFutureBooking == 'future'? Math.floor(Math.random() * 490) + 80: Math.floor(Math.random() * 590) + 20
  //     ),
  //   };
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: this.typeRevenue,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [
            {
              display: yAxis,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: .5,
              },
            },
          ],
        },
      },
      data: {
        labels: [
          'Monday' , 'Tuesday', 'Wednesday'
        ],
        datasets: [
          {
            showLine: true,
            fill: true,
            // type: this.type,
            label: "AM",
            // data: chartData.dataSet1,
            data: revenuechartData1,
            backgroundColor: [
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              // "rgba(255, 206, 86, 0.8)",
              // "rgba(255, 99, 132, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(153, 102, 255, 0.9)",
              // "rgba(255, 159, 64, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(255, 159, 64, 0.3)",
            ],
              spanGaps: true,
          },
          {
            
            showLine: true,
            fill: true,
            // type: this.type,
            label: "PM",
            // data: chartData.dataSet1,
            data: revenuechartData2,
            backgroundColor: [
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              // "rgba(255, 206, 86, 0.8)",
              // "rgba(255, 99, 132, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(153, 102, 255, 0.9)",
              // "rgba(255, 159, 64, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(255, 159, 64, 0.3)",
            ],
            lineTension: 0.1,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: true,
          },
        ],
      },
    });
  }

  // chart type Functions
  selectRevenueBookingSlotFuture() {
    this.barChart.destroy();
    this.createChart();
  }

  selectTypeRevenue(){
    this.barChart.destroy();
    this.createChart();
  }


  selectTypeBooking(){
    this.bookingchart.destroy();
    this.bookingChart();
  }

  selectTypeCaddies(){
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  selectTypeMembers(){
    this.membersChart.destroy();
    this.createMembersChart();
  }

  selectTypeMale(){
    this.maleChart.destroy();
    this.createMaleChart();
  }

  selectTypePax(){
    this.Pax.destroy();
    this.createtotalpaxChart();
  }

  selectTypeCourse(){
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  // globally changes Type of chart
  select(value) {
    this.typeBooking = value;
    this.typeCaddies = value;
    this.typeCourse = value;
    this.typePax= value;
    this.typeRevenue = value;
    this.typeMembers = value;
    this.typeMale = value;
    this.barChart.destroy();
    this.createChart();
    this.Pax.destroy();
    this.createtotalpaxChart();
    this.bookingchart.destroy();
    this.bookingChart();
    this.coursesCharts.destroy();
    this.createCoursesChart();
    this.caddiesChart.destroy();
    this.createCaddiesChart();
    this.membersChart.destroy();
    this.createMembersChart();
    this.maleChart.destroy();
    this.createMaleChart();
  }

//booking
verifyBookingToday: boolean = true;
verifyBookingWeek: boolean = false;
verifyBookingMonth: boolean = false;
verifyBookingFuture: boolean = false;
  bookingName:string = 'Todays Booking';
  bookingData:any =[{value:100},
    {value:100},
    {value:50},
    {value:20},
    {value:30},
  ]
  bookingtodayData(value) {
    this.verifyBookingToday = true;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = false;
    this.bookingName = 'Todays Booking'
     this.bookingData =[
      {value:100},
      {value:50},
      {value:50},
      {value:20},
      {value:30},
    ];
    this.slotFutureBooking = 'slots'
    this.bookingchart.destroy();
    this.bookingChart();
  }
   
  bookingthisWeekData(value) {
    this.verifyBookingToday = false;
    this.verifyBookingWeek = true;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = false;
    this.bookingName = 'This Week Bookings'
     this.bookingData =[
      {value:200},
      {value:100},
      {value:100},
      {value:60},
      {value:40},
    ];
    this.slotFutureBooking = 'week'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  bookingthisMonthData(value) {
    this.verifyBookingToday = false;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = true;
    this.verifyBookingFuture = false;
    this.bookingName = 'This Month Bookings'
     this.bookingData =[
      {value:300},
      {value:150},
      {value:150},
      {value:60},
      {value:90},
    ];
    this.slotFutureBooking = 'month'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  bookingfutureData(value){
    this.verifyBookingToday = false;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = true;
    this.bookingName = 'Future Bookings'
     this.bookingData =[
      {value:400},
      {value:200},
      {value:200},
      {value:120},
      {value:80},
    ];
    this.slotFutureBooking ='future'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  //revenue
  verifyRevenueToday: boolean = true;
  verifyRevenueWeek: boolean = false;
  verifyRevenueMonth: boolean = false;
  verifyRevenueFuture: boolean = false;
  revenueData: any =[
    {value:123456},
    {value:90000},
    {value:33456},
    {value:1234567},
  ];
  // verifyRevenueToday: boolean = true;
  verifyRevenue: boolean = false;
  revenueName: any = 'Todays Revenue';
  revenuetodayData(value) {
    this.verifyRevenueToday = true;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenuetoday';
    this.revenueName = 'Todays Revenue';
    this.revenueData =[
      {value:123456},
      {value:90000},
      {value:33456},
      {value:1234567},
    ];
    this.revenueSlotFutureBooking = 'slots';
    this.barChart.destroy();
    this.createChart();
  }
   
  revenuethisWeekData(value) {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = true;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenueweek';
    this.revenueName = 'This Week Revenue';
    this.revenueData =[
      {vale:456345},
      {value:5000},
      {value:356},
      {value:567566},
    ];
    this.revenueSlotFutureBooking = 'week';
    this.barChart.destroy();
    this.createChart();
  }

  revenuethisMonthData(value) {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = true;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenuemonth';
    this.revenueName = 'This Month Revenue';
    this.revenueData =[
      {value:13456},
      {value:6000},
      {value:336},
      {value:4567666},
    ];
    this.revenueSlotFutureBooking = 'month';
    this.barChart.destroy();
    this.createChart();
  }

  revenuefutureData() {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = true;
    // this.chartDate.activeClass = 'revenuefuture';
    this.revenueName = 'Future Revenue';
    this.revenueData =[
      {value:15657},
      {value:6733},
      {value:3547},
      {value:14567},
    ];
    this.revenueSlotFutureBooking = 'future';
    this.barChart.destroy();
    this.createChart();
  }

 //members
 verifyMemberToday: boolean = true;
 verifyMemberWeek: boolean = false;
 verifyMemberMonth: boolean = false;
 verifyMemberFuture: boolean = false;
 membersData: any =[
  {value:200},
  {value:300},
  {value:500},
];
verifyMember: boolean = false;
MemberName: any = 'Todays Member';
memberChartText = 'slots';
memberlastItem: any = '';
  membertodayData() {
    this.verifyMemberToday = true;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = false;
    this.MemberName = 'Todays Member';
    this.membersData =[
      {value:200},
      {value:300},
      {value:500},
    ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'slots';
    this.membersChart.destroy();
    this.createMembersChart();
  }
   
  memberthisWeekData(value) {
    this.verifyMemberToday = false;
    this.verifyMemberWeek = true;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = false;
    this.MemberName = 'This Week Member';
    this.membersData =[
      {value:100},
      {value:100},
      {value:200},
    ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'week';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  memberthisMonthData(value) {
    this.verifyMemberToday = false;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = true;
    this.verifyMemberFuture = false;
    this.MemberName = 'This Month Member';
    this.membersData =[
      {value:340},
      {value:100},
      {value:440},
    ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'month';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  memberfutureData(value){
    this.verifyMemberToday = false;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = true;
    this.MemberName = 'Future Member';
    this.membersData =[
      {value:400},
      {value:400},
      {value:800},
    ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'future';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  //male
  verifyMaleToday: boolean = true;
  verifyMaleWeek: boolean = false;
  verifyMaleMonth: boolean = false;
  verifyMaleFuture: boolean = false;
  maleData: any =[
    {value:400},
    {value:100},
    {value:500},
  ];

  verifyMale: boolean = false;
  MaleName: any = 'Todays Male/Female';
  maleChartText = 'slots';
  malelastItem: any = '';
  maletodayData() {
    this.verifyMaleToday = true;
    this.verifyMaleWeek = false;
    this.verifyMaleMonth = false;
    this.verifyMaleFuture = false;
    this.MaleName = 'Todays Male/Female';
    this.maleData =[
      {value:400},
      {value:100},
      {value:500},
    ];
    this.malelastItem = this.maleData.pop();
    this.maleData.push(this.malelastItem);
    this.maleChartText = 'slots';
    this.maleChart.destroy();
    this.createMaleChart();
  }
   
  malethisWeekData(value) {
    this.verifyMaleToday = false;
    this.verifyMaleWeek = true;
    this.verifyMaleMonth = false;
    this.verifyMaleFuture = false;
    this.MaleName = 'This Week Male/Female';
    this.maleData =[
      {value:340},
      {value:100},
      {value:440},
    ];
    this.malelastItem = this.maleData.pop();
    this.maleData.push(this.malelastItem);
    this.maleChartText = 'week';
    this.maleChart.destroy();
    this.createMaleChart();
  }

  malethisMonthData(value) {
    this.verifyMaleToday = false;
    this.verifyMaleWeek = false;
    this.verifyMaleMonth = true;
    this.verifyMaleFuture = false;
    this.MaleName = 'This Month Male/Female';
    this.maleData =[
      {value:400},
      {value:400},
      {value:800},
    ];
    this.malelastItem = this.maleData.pop();
    this.maleData.push(this.malelastItem);
    this.maleChartText = 'month';
    this.maleChart.destroy();
    this.createMaleChart();
  }

  malefutureData(value){
    this.verifyMaleToday = false;
    this.verifyMaleWeek = false;
    this.verifyMaleMonth = false;
    this.verifyMaleFuture = true;
    this.MaleName = 'Future Male/Female';
    this.maleData =[
      {value:200},
      {value:200},
      {value:400},
    ];
    this.malelastItem = this.maleData.pop();
    this.maleData.push(this.malelastItem);
    this.maleChartText = 'future';
    this.maleChart.destroy();
    this.createMaleChart();
  }

  //caddies
  verifyCaddiesToday: boolean = true;
  verifyCaddiesWeek: boolean = false;
  verifyCaddiesMonth: boolean = false;
  verifyCaddiesFuture: boolean = false;
  caddiesData: any =[
    {value:30},
    {value:170},
    {value:200},
  ];

  verifyCaddies: boolean = false;
  CaddiesName: any = 'Todays Caddies';
  caddiesChartText = 'slots';
  caddieslastItem: any = '';

  caddiestodayData() {
    this.verifyCaddiesToday = true;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'Todays Caddies';
    this.caddiesData =[
      {value:30},
      {value:170},
      {value:200},
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'slots';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }
   
  caddiesthisWeekData(value) {
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = true;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'This Week Caddies';
    this.caddiesData =[
      {value:300},
      {value:200},
      {value:500},
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'week';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  caddiesthisMonthData(value) {
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = true;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'This Month Caddies';
    this.caddiesData =[
      {value:600},
      {value:100},
      {value:700},
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'month';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  caddiesfutureData(value){
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = true;
    this.CaddiesName = 'Future Caddies';
    this.caddiesData =[
      {value:300},
      {value:600},
      {value:900},
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'future';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  //course
  verifyCoursesToday: boolean = true;
  verifyCoursesWeek: boolean = false;
  verifyCoursesMonth: boolean = false;
  verifyCoursesFuture: boolean = false;
   courseData: any =[
    {value:30},
    {value:170},
    {value:200},
    {value:400},
  ];

  verifyCourse: boolean = false;
  CourseName: any = 'Todays Course';
  courseChartText = 'slots';
  courselastItem: any = '';
  coursetodayData() {
    this.verifyCoursesToday = true;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = false;
    this.CourseName = 'Todays Course';
    this.courseData =[
      {value:170},
      {value:30},
      {value:200},
      {value:400},
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'slots';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }
   
  coursethisWeekData(value) {
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = true;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = false;
    this.CourseName = 'This Week Courses';
    this.courseData =[
      {value:50},
      {value:200},
      {value:30},
      {value:280},
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'week';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  coursethisMonthData(value) {
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = true;
    this.verifyCoursesFuture = false;
    this.CourseName = 'This Month Courses';
    this.courseData =[
      {value:200},
      {value:300},
      {value:100},
      {value:600},
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'month';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  coursefutureData(value){
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = true;
    this.CourseName = 'Future Courses';
    this.courseData =[
      {value:300},
      {value:100},
      {value:50},
      {value:450},
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'future';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }
 
}
