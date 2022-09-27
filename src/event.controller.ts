import * as moment from "moment";
import {Controller, Get} from '@nestjs/common';
import {Event} from './entities/event.entity';
import {In, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Workshop} from "./entities/workshop.entity";

@Controller()
export class EventController {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Workshop) private workshopRepository: Repository<Workshop>
    ) {
    }

    @Get('warmupevents')
    getWarmupEvents() {
        return this.eventRepository.find();
    }

    /*
       Requirements:
      - maximum 2 sql queries
      - verify your solution with `php artisan test`
      - do a `git commit && git push` after you are done or when the time limit is over
      Hints:
      - open the `app/Http/Controllers/EventsController` file
      - partial or not working answers also get graded so make sure you commit what you have
      Sample response on GET /events:
      ```json
      [
        {
          id: 1,
          name: 'Laravel convention 2021',
          created_at: '2021-04-25T09:32:27.000000Z',
          updated_at: '2021-04-25T09:32:27.000000Z',
          workshops: [
            {
              id: 1,
              start: '2021-02-21 10:00:00',
              end: '2021-02-21 16:00:00',
              event_id: 1,
              name: 'Illuminate your knowledge of the laravel code base',
              created_at: '2021-04-25T09:32:27.000000Z',
              updated_at: '2021-04-25T09:32:27.000000Z',
            },
          ],
        },
        {
          id: 2,
          name: 'Laravel convention 2023',
          created_at: '2023-04-25T09:32:27.000000Z',
          updated_at: '2023-04-25T09:32:27.000000Z',
          workshops: [
            {
              id: 2,
              start: '2023-10-21 10:00:00',
              end: '2023-10-21 18:00:00',
              event_id: 2,
              name: 'The new Eloquent - load more with less',
              created_at: '2021-04-25T09:32:27.000000Z',
              updated_at: '2021-04-25T09:32:27.000000Z',
            },
            {
              id: 3,
              start: '2023-11-21 09:00:00',
              end: '2023-11-21 17:00:00',
              event_id: 2,
              name: 'AutoEx - handles exceptions 100% automatic',
              created_at: '2021-04-25T09:32:27.000000Z',
              updated_at: '2021-04-25T09:32:27.000000Z',
            },
          ],
        },
        {
          id: 3,
          name: 'React convention 2023',
          created_at: '2023-04-25T09:32:27.000000Z',
          updated_at: '2023-04-25T09:32:27.000000Z',
          workshops: [
            {
              id: 4,
              start: '2023-08-21 10:00:00',
              end: '2023-08-21 18:00:00',
              event_id: 3,
              name: '#NoClass pure functional programming',
              created_at: '2021-04-25T09:32:27.000000Z',
              updated_at: '2021-04-25T09:32:27.000000Z',
            },
            {
              id: 5,
              start: '2023-08-21 09:00:00',
              end: '2023-08-21 17:00:00',
              event_id: 3,
              name: 'Navigating the function jungle',
              created_at: '2021-04-25T09:32:27.000000Z',
              updated_at: '2021-04-25T09:32:27.000000Z',
            },
          ],
        },
      ]
       */

    @Get('events')
    async getEventsWithWorkshops() {
        // Implement in coding task 1
        const events = await this.eventRepository.find();
        const eventIds = events.map(event => event.id);

        const workshops = await this.workshopRepository.find({where: {event_id: In(eventIds)}});

        return events.map(event => ({
            ...event,
            workshops: workshops.filter(workshop => workshop.event_id === event.id)
        }));
    }

    /*
      Requirements:
      - only events that have not yet started should be included
      - the event starting time is determined by the first workshop of the event
      - the eloquent expressions should result in maximum 3 SQL queries, no matter the amount of events
      - all filtering of records should happen in the database
      - verify your solution with `php artisan test`
      - do a `git commit && git push` after you are done or when the time limit is over
      Hints:
      - open the `app/Http/Controllers/EventsController` file
      - partial or not working answers also get graded so make sure you commit what you have
      - join, whereIn, min, groupBy, havingRaw might be helpful
      - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
      Sample response on GET /futureevents:
      ```json
      [
          {
              "id": 2,
              "name": "Laravel convention 2023",
              "created_at": "2023-04-20T07:01:14.000000Z",
              "updated_at": "2023-04-20T07:01:14.000000Z",
              "workshops": [
                  {
                      "id": 2,
                      "start": "2023-10-21 10:00:00",
                      "end": "2023-10-21 18:00:00",
                      "event_id": 2,
                      "name": "The new Eloquent - load more with less",
                      "created_at": "2021-04-20T07:01:14.000000Z",
                      "updated_at": "2021-04-20T07:01:14.000000Z"
                  },
                  {
                      "id": 3,
                      "start": "2023-11-21 09:00:00",
                      "end": "2023-11-21 17:00:00",
                      "event_id": 2,
                      "name": "AutoEx - handles exceptions 100% automatic",
                      "created_at": "2021-04-20T07:01:14.000000Z",
                      "updated_at": "2021-04-20T07:01:14.000000Z"
                  }
              ]
          },
          {
              "id": 3,
              "name": "React convention 2023",
              "created_at": "2023-04-20T07:01:14.000000Z",
              "updated_at": "2023-04-20T07:01:14.000000Z",
              "workshops": [
                  {
                      "id": 4,
                      "start": "2023-08-21 10:00:00",
                      "end": "2023-08-21 18:00:00",
                      "event_id": 3,
                      "name": "#NoClass pure functional programming",
                      "created_at": "2021-04-20T07:01:14.000000Z",
                      "updated_at": "2021-04-20T07:01:14.000000Z"
                  },
                  {
                      "id": 5,
                      "start": "2023-08-21 09:00:00",
                      "end": "2023-08-21 17:00:00",
                      "event_id": 3,
                      "name": "Navigating the function jungle",
                      "created_at": "2021-04-20T07:01:14.000000Z",
                      "updated_at": "2021-04-20T07:01:14.000000Z"
                  }
              ]
          }
      ]
      ```
       */

    @Get('future-events')
    async getFutureEventWithWorkshops() {
        const events = await this.eventRepository.find();
        const eventIds = events.map(event => event.id);
        const workshops = await this.workshopRepository.find({where: {event_id: In(eventIds)}});

        return events
            .filter(event => {
                const eventWorkShops = workshops.filter(workshop => workshop.event_id === event.id && moment().isBefore(workshop.start));
                return Boolean(eventWorkShops.length);
            })
            .map(event => ({...event, workshops: workshops.filter(workshop => workshop.event_id === event.id)}));
    }
}
