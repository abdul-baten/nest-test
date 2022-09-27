import {Controller, Get} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MenuItem} from "./entities/menu.entity";
import {Repository} from "typeorm";

@Controller()
export class MenuController {

    constructor(@InjectRepository(MenuItem) private menuItemsRepository: Repository<MenuItem>) {
    }

    /*
      Requirements:
      - the eloquent expressions should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
      - it should work for infinite level of depth (children of children children's of children's children, ...)
      - verify your solution with `php artisan test`
      - do a `git commit && git push` after you are done or when the time limit is over
      Hints:
      - open the `app/Http/Controllers/MenuController` file
      - eager loading cannot load deeply nested relationships
      - a recursive function in php is needed to structure the query results
      - partial or not working answers also get graded so make sure you commit what you have
      Sample response on GET /menu:
      ```json
      [
          {
              "id": 1,
              "name": "All events",
              "url": "/events",
              "parent_id": null,
              "created_at": "2021-04-27T15:35:15.000000Z",
              "updated_at": "2021-04-27T15:35:15.000000Z",
              "children": [
                  {
                      "id": 2,
                      "name": "Laracon",
                      "url": "/events/laracon",
                      "parent_id": 1,
                      "created_at": "2021-04-27T15:35:15.000000Z",
                      "updated_at": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 3,
                              "name": "Illuminate your knowledge of the laravel code base",
                              "url": "/events/laracon/workshops/illuminate",
                              "parent_id": 2,
                              "created_at": "2021-04-27T15:35:15.000000Z",
                              "updated_at": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 4,
                              "name": "The new Eloquent - load more with less",
                              "url": "/events/laracon/workshops/eloquent",
                              "parent_id": 2,
                              "created_at": "2021-04-27T15:35:15.000000Z",
                              "updated_at": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  },
                  {
                      "id": 5,
                      "name": "Reactcon",
                      "url": "/events/reactcon",
                      "parent_id": 1,
                      "created_at": "2021-04-27T15:35:15.000000Z",
                      "updated_at": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 6,
                              "name": "#NoClass pure functional programming",
                              "url": "/events/reactcon/workshops/noclass",
                              "parent_id": 5,
                              "created_at": "2021-04-27T15:35:15.000000Z",
                              "updated_at": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 7,
                              "name": "Navigating the function jungle",
                              "url": "/events/reactcon/workshops/jungle",
                              "parent_id": 5,
                              "created_at": "2021-04-27T15:35:15.000000Z",
                              "updated_at": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  }
              ]
          }
      ]
       */
    @Get('menu')
    async getMenuItems() {
        const menus = (await this.menuItemsRepository.find()).map(menu => ({...menu, children: []}));

        const recursivelyPrepareChildren = (menuId: number) => {
            const rMenus = [...menus].filter(menu => menu.parent_id);
            const children = [];

            for (let menu of rMenus) {
                if (menu && menu.parent_id && menu.parent_id === menuId) {
                    children.push(menu);
                }
            }

            for (let child of children) {
                child.children = recursivelyPrepareChildren(child.id);
            }

            return children;
        }

        return menus
            .map(menu => ({...menu, children: recursivelyPrepareChildren(menu.id)}))
            .filter(menu => Boolean(menu.children.length));
    }
}
