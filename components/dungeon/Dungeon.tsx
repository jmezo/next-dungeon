import { Component } from "react";
import * as types from "./types";
import {
  Box,
  Badge,
  Image,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
} from "@chakra-ui/react";

interface IProps {}

interface IState {
  actions: types.Creature[];
}

const dummyCreatures: types.Creature[] = [
  {
    type: 1,
    attr: { attack: 1, defense: 1, hitpoints: 1, damage: { min: 1, max: 1 } },
    health: 1,
    size: 1,
  },
  {
    type: 2,
    attr: { attack: 1, defense: 1, hitpoints: 1, damage: { min: 1, max: 1 } },
    health: 1,
    size: 1,
  },
];

export default class Dungeon extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      actions: dummyCreatures,
    };
  }

  showActions() {
    return this.state.actions.map((creature, i) => {
      return (
        <Box key={i} display="flex" alignItems="center">
          <Image src={`/creatures/${creature.type}.png`} alt="asd" />
          <Box display="flex" alignItems="baseline">
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="lg">
                  {types.CreatureType[creature.type]}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>stats</PopoverHeader>
                <PopoverBody>
                  <Text>health: {creature.health}</Text>
                  <Text>size: {creature.size}</Text>
                  <Text>attributes:</Text>
                  <Text>&emsp; attack: {creature.attr.attack}</Text>
                  <Text>&emsp; defense: {creature.attr.defense}</Text>
                  <Text>&emsp; hitpoints: {creature.attr.hitpoints}</Text>
                  <Text>
                    &emsp; damage: {creature.attr.damage.min} -{" "}
                    {creature.attr.damage.max}
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Box>
      );
    });
  }

  render() {
    return (
      <div>
        <ol>{this.showActions()}</ol>
      </div>
    );
  }
}
