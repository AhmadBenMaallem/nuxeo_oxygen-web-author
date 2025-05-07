
# 🛠️ Ajouter une Toolbar Personnalisée dans Oxygen Web Author pour un Framework Custom

Ce guide explique comment configurer une barre d’outils avec des actions personnalisées, comme appliquer du **gras** avec une balise `<B>`, dans un framework personnalisé pour **Oxygen Web Author**.

---

## 📋 Prérequis

1. **Votre schéma** doit permettre l'élément que vous souhaitez utiliser (ex : `<B>` dans `<texte>`).
2. Un **fichier `.framework`** doit être présent.  
   Si vous avez uniquement un `.exf`, suivez ce tutoriel pour compiler le `.framework` :  
   🔗 [Compile Framework Script – Oxygen XML Editor](https://www.oxygenxml.com/doc/versions/27.1/ug-editor/topics/scripting_oxygen_compile_framework_script.html)

---

## 🧩 Étapes de configuration

### 1. ✅ Assurez-vous que votre schéma accepte l’élément cible

Par exemple, dans votre schéma XML, le contenu de `<texte>` doit permettre `<B>` :

```xml
<xs:complexType name="texteType" mixed="true">
  <xs:choice minOccurs="0" maxOccurs="unbounded">
    <xs:element name="B" type="xs:string"/>
    <!-- autres éléments -->
  </xs:choice>
</xs:complexType>
```

---

### 2. 🏗️ Ajouter l’action dans le fichier `.framework`

Dans le fichier `.framework`, insérez les balises suivantes dans la section `authorExtensionDescriptor` :

```xml
...
<field name="authorExtensionDescriptor">
  <authorExtension>
    ...
    <field name="actionDescriptors">
      <action-array>
        <action>
          <field name="id">
            <String>bold</String>
          </field>
          <field name="name">
            <String>${i18n(bold)}</String>
          </field>
          <field name="description">
            <String>${i18n(bold_description)}</String>
          </field>
          <field name="largeIconPath">
            <String>/images/Bold24.png</String>
          </field>
          <field name="smallIconPath">
            <String>/images/Bold16.png</String>
          </field>
          <field name="accessKey">
            <String>B</String>
          </field>
          <field name="accelerator">
            <String>M1 B</String> <!-- Ctrl/Cmd + B -->
          </field>
          <field name="actionModes">
            <actionMode-array>
              <actionMode>
                <field name="xpathCondition">
                  <String></String>
                </field>
                <field name="argValues">
                  <serializableOrderedMap>
                    <entry>
                      <String>element</String>
                      <String>&lt;B xmlns="http://my.custom.namespace"/></String>
                    </entry>
                  </serializableOrderedMap>
                </field>
                <field name="operationID">
                  <String>ro.sync.ecss.extensions.commons.operations.ToggleSurroundWithElementOperation</String>
                </field>
              </actionMode>
            </actionMode-array>
          </field>
          <field name="enabledInReadOnlyContext">
            <Boolean>false</Boolean>
          </field>
        </action>
      </action-array>
    </field>
    ...
```

---

### 3. 🎛️ Ajouter un bouton dans la barre d’outils

Toujours dans le fichier `.framework`, ajoutez la configuration suivante :

```xml
...
<field name="toolbarDescriptor">
  <toolbar>
    <field name="id">
      <String>Toolbar</String>
    </field>
    <field name="type">
      <Integer>2</Integer> <!-- Type = Author mode -->
    </field>
    <field name="toolbarEntriesDescriptorList">
      <toolbarEntry-array>
        <toolbarItem>
          <field name="actionID">
            <String>bold</String>
          </field>
        </toolbarItem>
      </toolbarEntry-array>
    </field>
  </toolbar>
</field>
...
```

---

### 4. 🎨 Ajouter le style dans le fichier `main.css`

Ajoutez la règle suivante pour que le `<B>` s’affiche en gras dans Web Author :

```css
@namespace my "http://my.custom.namespace";

my|B {
  font-weight: bold;
}
```

Assurez-vous que ce fichier CSS est référencé dans le `.framework` via le champ `cssStyles`.

---

## ✅ Résultat

Lorsque vous ouvrez un fichier XML utilisant ce framework dans **Web Author**, vous verrez un bouton **gras** dans la barre d’outils. Cliquer dessus applique automatiquement la balise `<B>` autour du texte sélectionné.
