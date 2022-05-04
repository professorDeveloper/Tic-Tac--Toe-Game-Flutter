import 'package:flutter/material.dart';
import 'package:online_tic_tac_toe/responsive/responsive.dart';
import 'package:online_tic_tac_toe/screens/join_room_screen.dart';
import 'package:online_tic_tac_toe/widget/custom_button.dart';

import 'create_room_screen.dart';
class MainMenuScreen extends StatelessWidget {
  static String routeName='/main-menu';
  const MainMenuScreen({Key? key}) : super(key: key);

  createRoom(BuildContext context){
    Navigator.pushNamed(context, CreateRoomScreen.routeName);
  }

  joinRoom(BuildContext context){
    Navigator.pushNamed(context, JoinRoomScreen.routeName);
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Responsive(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20.0),
                child: Image.asset('assets/images/board-game.png',width: 120,height: 120,),
              ),
              SizedBox(height: 20,),
              CustomButton(onTap:() => createRoom(context),text:"Create Room"),
              SizedBox(height: 20,),
              CustomButton(onTap:()=>joinRoom(context),text:"Join Room"),

            ],
      ),
        )
    );
  }
}
