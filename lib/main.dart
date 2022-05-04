import 'package:flutter/material.dart';
import 'package:online_tic_tac_toe/screens/create_room_screen.dart';
import 'package:online_tic_tac_toe/screens/game_screen.dart';
import 'package:online_tic_tac_toe/screens/join_room_screen.dart';
import 'package:online_tic_tac_toe/screens/main_menu_screens.dart';
import 'package:online_tic_tac_toe/utils/colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: bgColor
      ),
      routes: {
        MainMenuScreen.routeName:(context)=>const MainMenuScreen(),
        CreateRoomScreen.routeName:(context)=>const CreateRoomScreen(),
        JoinRoomScreen.routeName:(context)=>const JoinRoomScreen(),
        GameScreen.routeName:(context)=>const GameScreen(),
      },
      initialRoute: MainMenuScreen.routeName,
      home: const MainMenuScreen(),
    );
  }
}