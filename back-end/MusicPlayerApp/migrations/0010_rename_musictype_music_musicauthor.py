# Generated by Django 4.2.4 on 2023-10-02 10:08

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        (
            "MusicPlayerApp",
            "0009_rename_musics_music_remove_userrole_musiclistin_and_more",
        ),
    ]

    operations = [
        migrations.RenameField(
            model_name="music",
            old_name="musicType",
            new_name="musicAuthor",
        ),
    ]
